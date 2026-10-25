/**
 * Главный интерпретатор PowerShell.
 * Точка входа: execute(line, env) → { output, result }
 *
 * Безопасность: пользовательский ввод НЕ превращается в JavaScript.
 * Все команды проходят через parser → evaluator → commands → virtual environment.
 */

import { tokenize } from './parser.js';
import { comparisonOps, getProperty, splitBracketed, findClosingBracket, isBalancedOuter, splitByOperator, range, add, subtract, multiply, divide, modulo } from './evaluator.js';
import { resolveAlias } from './aliases.js';
import { getCommands } from './commands.js';
import { formatOutput } from './formatter.js';

/**
 * Сигнал возврата из функции (аналог return).
 */
class ReturnSignal {
  constructor(value) { this.value = value; }
}

/**
 * Создать экземпляр интерпретатора с изолированным состоянием.
 */
export function createInterpreter(env) {
  const V = Object.create(null); // переменные окружения
  const FN = {};                 // пользовательские функции
  let CAUGHT = false;            // был ли try/catch в текущем запуске
  let CUR = null;                // $_ — текущий объект конвейера
  let depth = 0;                 // глубина рекурсии exec

  /** Оценить выражение (без вызова командлетов). */
  function evalExpr(s) {
    s = String(s).trim();
    if (!s) return '';

    // Баланс скобок: снять внешние ( )
    if (isBalancedOuter(s)) return evalExpr(s.slice(1, -1));

    // Строка в двойных кавычках — подстановка переменных
    if (/^"[^"]*"$/.test(s)) return interpolate(s.slice(1, -1));

    // Строка в одинарных кавычках
    if (/^'[^']*'$/.test(s)) return s.slice(1, -1);

    let m;

    // (команда).Свойство
    if ((m = s.match(/^\(([\s\S]+)\)\.([A-Za-z_]\w*)$/))) {
      const r = exec(m[1]);
      const vals = r.map(v => getProperty(v, m[2]));
      return vals.length === 1 ? vals[0] : vals;
    }

    // $(команда)
    if ((m = s.match(/^\$\(([\s\S]+)\)$/))) {
      const r = exec(m[1]);
      return r.length === 1 ? r[0] : r;
    }

    // $true / $false / $null
    if (/^\$true$/i.test(s)) return true;
    if (/^\$false$/i.test(s)) return false;
    if (/^\$null$/i.test(s)) return null;

    // Диапазон 1..5
    if ((m = s.match(/^(-?\d+)\.\.(-?\d+)$/))) return range(+m[1], +m[2]);

    // Массив @(элементы)
    if ((m = s.match(/^@\(([\s\S]*)\)$/))) {
      if (!m[1].trim()) return [];
      const p = splitBracketed(m[1], ',');
      return p.length > 1 ? p.map(evalExpr) : exec(m[1]);
    }

    // @(...).Count
    if ((m = s.match(/^(@\([\s\S]*\))\.([A-Za-z_]\w*)$/))) {
      return getProperty(evalExpr(m[1]), m[2]);
    }

    // @{ ... } хэш-таблица
    if ((m = s.match(/^(\[pscustomobject\]\s*)?@\{([\s\S]*)\}$/i))) {
      const o = {};
      for (const pair of splitBracketed(m[2].replace(/\n/g, ';'), ';')) {
        const q = pair.trim();
        if (!q) continue;
        const eq = q.indexOf('=');
        if (eq < 0) throw new Error('Неверная запись в хэш-таблице: ' + q);
        o[q.slice(0, eq).trim().replace(/^["']|["']$/g, '')] = evalExpr(q.slice(eq + 1));
      }
      if (!m[1]) Object.defineProperty(o, '__ht', { value: true });
      return env.proxyWrap(o);
    }

    // $var[index]
    if ((m = s.match(/^(\$[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\[([^\[\]]+)\]$/))) {
      const v = evalExpr(m[1]);
      const i = evalExpr(m[2]);
      return Array.isArray(v) ? v[i < 0 ? v.length + i : i] : getProperty(v, String(i));
    }

    // $var или $var.prop
    if ((m = s.match(/^\$[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*$/))) {
      return resolveVar(s);
    }

    // Число
    if ((m = s.match(/^(-?\d+(?:\.\d+)?)$/))) return Number(s);

    // Запятая: перечисление
    {
      const parts = splitBracketed(s, ',');
      if (parts.length > 1) return parts.map(evalExpr);
    }

    // Логические операторы: -or, -and
    for (const ops of [['-or'], ['-and']]) {
      const z = splitByOperator(s, ops, false);
      if (z) {
        const a = evalExpr(z[0]), b = evalExpr(z[2]);
        if (z[1] === '-or') return !!a || !!b;
        if (z[1] === '-and') return !!a && !!b;
      }
    }

    // Операторы сравнения
    {
      const ops = ['-eq', '-ne', '-gt', '-lt', '-ge', '-le', '-like', '-notlike', '-match', '-notmatch', '-contains', '-in'];
      const z = splitByOperator(s, ops, true);
      if (z) {
        const a = evalExpr(z[0]), b = evalExpr(z[2]);
        switch (z[1]) {
          case '-eq': return String(a).toLowerCase() === String(b).toLowerCase();
          case '-ne': return String(a).toLowerCase() !== String(b).toLowerCase();
          case '-gt': return a > b;
          case '-lt': return a < b;
          case '-ge': return a >= b;
          case '-le': return a <= b;
          case '-like': return comparisonOps.like(a, b);
          case '-notlike': return comparisonOps.notlike(a, b);
          case '-match': return comparisonOps.match(a, b);
          case '-notmatch': return comparisonOps.notmatch(a, b);
          case '-contains': return comparisonOps.contains(a, b);
          case '-in': return comparisonOps.in(a, b);
        }
      }
    }

    // Арифметика: +-*/%
    for (const ops of [['+', '-'], ['*', '/', '%']]) {
      const z = splitByOperator(s, ops, ops[0] === '+' || ops[0] === '*');
      if (z) {
        const a = evalExpr(z[0]), b = evalExpr(z[2]);
        if (z[1] === '+') return add(a, b);
        if (z[1] === '-') return subtract(a, b);
        if (z[1] === '*') return multiply(a, b);
        if (z[1] === '/') return divide(a, b);
        if (z[1] === '%') return modulo(a, b);
      }
    }

    // -not
    if ((m = s.match(/^-not\s+([\s\S]+)$/i))) return !evalExpr(m[1]);
    if (s[0] === '!' && s.length > 1) return !evalExpr(s.slice(1));

    // .ToUpper() / .ToLower()
    if ((m = s.match(/^("[^"]*"|'[^']*'|\$[A-Za-z_]\w*|[A-Za-z_]\w*)\.(ToUpper|ToLower)\s*\(\)$/i))) {
      const v = evalExpr(m[1]);
      return m[2].toLowerCase() === 'toupper' ? String(v).toUpperCase() : String(v).toLowerCase();
    }

    // .Contains()
    if ((m = s.match(/^(.+)\.Contains\((.*)\)$/i))) {
      return String(evalExpr(m[1])).includes(evalExpr(m[2]));
    }

    // Разрешаем только простые идентификаторы и $.
    if (/^[A-Za-z_][\w-]*$/.test(s)) {
      throw new Error(`Термин "${s}" не распознан как имя командлета, функции или программы. Get-Command покажет доступные команды.`);
    }

    if (/^[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*$/.test(s)) {
      const parts = s.split('.');
      let v = V[parts.shift().toLowerCase()];
      for (const k of parts) v = getProperty(v, k);
      return v;
    }

    throw new Error('Неподдерживаемое выражение: ' + s);
  }

  /** Подставить переменные в строку ($name, $(command)). */
  function interpolate(str) {
    return str.replace(/\$\(([^()]*)\)|\$([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)/g, (m, cmd, vn) => {
      try {
        if (cmd !== undefined) {
          const r = exec(cmd);
          return r.map(z => z && typeof z === 'object' ? formatOutput([z], env.proxyWrap) : String(z)).join(' ');
        }
        const v = resolveVar('$' + vn);
        return v == null ? '' : Array.isArray(v) ? v.join(' ') : String(v);
      } catch (e) { return m; }
    }).replace(/`n/g, '\n');
  }

  /** Разрешить ссылку на переменную $var или $var.prop. */
  function resolveVar(x) {
    const m = x.match(/^\$([A-Za-z_]\w*)((?:\.[A-Za-z_]\w*)*)$/);
    if (!m) return undefined;
    let v = m[1] === '_' ? CUR : V[m[1].toLowerCase()];
    for (const k of m[2].split('.').filter(Boolean)) v = getProperty(v, k);
    return v;
  }

  /** Преобразовать токен в значение: число, строка, блок, переменная. */
  function toValue(token) {
    if (token[0] === '{') return token; // блок — обрабатывается отдельно
    if (/^["'$(@]/.test(token)) return evalExpr(token);
    if (/^-?\d+(\.\d+)?$/.test(token)) return +token;
    if (token.includes(',')) return token.split(',');
    return token;
  }

  /** Извлечь токены аргументов и преобразовать значения. */
  function parseTokenValues(tokens) {
    const args = { _: [], n: {} };
    const switchNames = new Set(['recurse', 'descending', 'force', 'unique', 'simplematch', 'autosize', 'sum', 'average', 'maximum', 'minimum']);
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (/^-[a-z]/i.test(token)) {
        const key = token.slice(1).toLowerCase();
        if (switchNames.has(key) || i + 1 >= tokens.length || /^-[a-z]/i.test(tokens[i + 1])) {
          args.n[key] = true;
        } else {
          args.n[key] = toValue(tokens[++i]);
        }
      } else {
        args._.push(toValue(token));
      }
    }
    return args;
  }

  /** Выполнить блок кода { ... } с $_ = currentItem. */
  function runBlock(blockCode, currentItem) {
    if (typeof blockCode !== 'string' || blockCode[0] !== '{') {
      throw new Error('Ожидался блок { ... }.');
    }
    const prev = CUR;
    CUR = currentItem;
    try {
      return runMultiline(blockCode.trim().slice(1, -1));
    } finally {
      CUR = prev;
    }
  }

  /** Выполнить несколько строк (; и \n разделители). */
  function runMultiline(s) {
    const out = [];
    for (const part of splitBracketed(s, ';')) {
      for (const line of splitBracketed(part, '\n')) {
        out.push(...exec(line));
      }
    }
    return out;
  }

  function coerceParamValue(typeName, value) {
    if (value === undefined || value === null || !typeName) return value;
    const type = String(typeName).toLowerCase();
    if (type === 'int' || type === 'long') return Number.isFinite(Number(value)) ? parseInt(Number(value), 10) : value;
    if (type === 'double' || type === 'float' || type === 'decimal') return Number(value);
    if (type === 'string') return String(value);
    if (type === 'bool') return !!value;
    if (type === 'array') return Array.isArray(value) ? value : [value];
    return value;
  }

  function parseParamSpec(spec) {
    const s = String(spec).trim();
    if (!s) return null;
    const match = s.match(/^(?:\[([^\]]+)\])?\s*(?:\$)?([A-Za-z_][\w]*)\s*(?:=\s*([\s\S]+))?$/);
    if (!match) return { name: s.replace(/^\$?/, '').split('=')[0].trim().toLowerCase(), type: null, defaultValue: undefined };
    const [, type, name, defaultValue] = match;
    return {
      name: name.toLowerCase(),
      type: type ? type.trim().toLowerCase() : null,
      defaultValue: defaultValue !== undefined ? evalExpr(defaultValue.trim()) : undefined
    };
  }

  /** Вызвать пользовательскую функцию. */
  function callUserFunction(fnDef, args) {
    const saved = {}, had = {}, names = [], pos = [];
    let body = fnDef.b;

    // param(...) внутри тела функции
    const pm = body.match(/^\s*param\s*\(([\s\S]*?)\)\s*;?\s*/i);
    let params = (fnDef.params || fnDef.p || []).map(p => (typeof p === 'string' ? { name: p, type: null, defaultValue: undefined } : p));
    if (pm) {
      body = body.slice(pm[0].length);
      params = splitBracketed(pm[1], ',').map(parseParamSpec).filter(Boolean);
    }

    params.forEach((p, i) => {
      const name = p.name;
      names.push(name);
      had[name] = Object.prototype.hasOwnProperty.call(V, name);
      saved[name] = V[name];
      const value = args.n[name] !== undefined ? args.n[name] : args._[i] !== undefined ? args._[i] : p.defaultValue;
      V[name] = coerceParamValue(p.type, value);
    });

    const used = new Set(params.map((p, i) => args.n[p.name] !== undefined ? i : -1).filter(i => i >= 0));
    args._.forEach((v, i) => { if (i >= params.length) pos.push(v); });

    const oldArgs = V.args, hadArgs = Object.prototype.hasOwnProperty.call(V, 'args');
    V.args = pos;

    try {
      return runMultiline(body);
    } catch (e) {
      if (e instanceof ReturnSignal) return e.value;
      throw e;
    } finally {
      names.forEach(p => { if (had[p]) V[p] = saved[p]; else delete V[p]; });
      if (hadArgs) V.args = oldArgs; else delete V.args;
    }
  }

  /** Обработать try/catch/finally. */
  function runTry(line) {
    const braceStart = line.indexOf('{');
    const braceEnd = findClosingBracket(line, braceStart);
    if (braceEnd < 0) throw new Error('Не закрыта скобка } в блоке try.');
    const tryBody = line.slice(braceStart + 1, braceEnd);
    let rest = line.slice(braceEnd + 1).trim();
    let catchBody = null, finallyBody = null;

    function readBlock(word) {
      const j = rest.indexOf('{');
      if (j < 0) return null;
      const k = findClosingBracket(rest, j);
      if (k < 0) throw new Error('Не закрыта скобка } в блоке ' + word + '.');
      const b = rest.slice(j + 1, k);
      rest = rest.slice(k + 1).trim();
      return b;
    }

    if (/^catch\b/i.test(rest)) catchBody = readBlock('catch');
    if (/^finally\b/i.test(rest)) finallyBody = readBlock('finally');
    if (catchBody === null && finallyBody === null) throw new Error('После try нужен блок catch или finally.');

    let output = [];
    try {
      try {
        output = runMultiline(tryBody);
      } catch (er) {
        if (er instanceof ReturnSignal || catchBody === null) throw er;
        CAUGHT = true;
        const msg = er && er.message ? er.message : 'Ошибка';
        const oldCur = CUR;
        CUR = env.strObj(msg, { Message: msg, Exception: env.proxyWrap({ Message: msg }) });
        try { output = runMultiline(catchBody); } finally { CUR = oldCur; }
      }
    } finally {
      if (finallyBody !== null) output.push(...runMultiline(finallyBody));
    }
    return output;
  }

  /** Выполнить один элемент конвейера. */
  function pipelineStage(s, input) {
    const tokens = tokenize(s);
    const name = tokens[0].toLowerCase();

    // Пользовательская функция
    if (FN[name]) {
      return callUserFunction(FN[name], parseTokenValues(tokens));
    }

    // Командлет
    const resolvedName = resolveAlias(name) || name;
    const cmds = getCommands();
    const cmdFn = cmds[(resolvedName).toLowerCase()] || cmds[Object.keys(cmds).find(k => k.toLowerCase() === name)];

    if (cmdFn) {
      const args = parseTokenValues(tokens);
      const inp = input || [];

      // Where-Object с блоком
      if (name === 'where' || name === '?' || name === 'where-object') {
        const block = args._[0];
        if (typeof block === 'string' && block[0] === '{') {
          return inp.filter(x => {
            const r = runBlock(block, x);
            return r.length && r[r.length - 1];
          });
        }
        // Где нет блока — сравнение свойства
        const prop = args._[0];
        for (const op of ['eq', 'ne', 'gt', 'lt', 'ge', 'le', 'like', 'match', 'contains']) {
          if (args.n[op] !== undefined) {
            return inp.filter(x => {
              const pv = x[prop];
              const cmp = {
                eq: () => String(pv).toLowerCase() === String(args.n[op]).toLowerCase(),
                ne: () => String(pv).toLowerCase() !== String(args.n[op]).toLowerCase(),
                gt: () => pv > args.n[op],
                lt: () => pv < args.n[op],
                ge: () => pv >= args.n[op],
                le: () => pv <= args.n[op],
                like: () => comparisonOps.like(String(pv), args.n[op]),
                match: () => new RegExp(String(args.n[op]), 'i').test(String(pv)),
                contains: () => [].concat(pv).includes(args.n[op])
              };
              return cmp[op] ? cmp[op]() : false;
            });
          }
        }
      }

      // ForEach-Object
      if (name === 'foreach' || name === '%' || name === 'foreach-object') {
        const block = args._[0] || args.n.process;
        if (!block) throw new Error('ForEach-Object требует блок, например: ForEach-Object { $_.Name }');
        return inp.flatMap(x => runBlock(block, x));
      }

      return cmdFn(args, inp) || [];
    }

    // Выражение без командлета
    if (input !== null) {
      throw new Error(`Термин "${tokens[0]}" не распознан как имя командлета, функции или программы.`);
    }

    // Если это просто идентификатор и есть больше токенов — ошибка
    if (tokens.length > 1 && /^[A-Za-z_][\w-]*$/.test(tokens[0])) {
      throw new Error(`Термин "${tokens[0]}" не распознан как имя командлета, функции или программы.`);
    }

    const r = evalExpr(s);
    return r === undefined ? [] : Array.isArray(r) ? r : [r];
  }

  function findMatchingPair(str, startIndex, openChar, closeChar) {
    let depth = 0;
    let quote = '';
    for (let i = startIndex; i < str.length; i++) {
      const ch = str[i];
      if (quote) {
        if (ch === quote) quote = '';
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        continue;
      }
      if (ch === openChar) depth++;
      else if (ch === closeChar) {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function parseControlBlock(line, keyword) {
    const startIndex = line.search(new RegExp(`\\b${keyword}\\b`, 'i'));
    if (startIndex < 0) return null;
    const parenStart = line.indexOf('(', startIndex + keyword.length);
    if (parenStart < 0) return null;
    const parenEnd = findMatchingPair(line, parenStart, '(', ')');
    if (parenEnd < 0) return null;
    const braceStart = line.indexOf('{', parenEnd + 1);
    if (braceStart < 0) return null;
    const braceEnd = findClosingBracket(line, braceStart);
    if (braceEnd < 0) throw new Error(`Не закрыта скобка } в блоке ${keyword}.`);
    return {
      condition: line.slice(parenStart + 1, parenEnd).trim(),
      body: line.slice(braceStart + 1, braceEnd),
      rest: line.slice(braceEnd + 1).trim()
    };
  }

  function readElseBranch(rest) {
    const trimmed = rest.trim();
    if (!trimmed || !/^else\b/i.test(trimmed)) return null;
    const tail = trimmed.replace(/^else\b\s*/i, '').trim();
    if (!tail) return null;
    if (/^if\b/i.test(tail)) return { type: 'if', value: tail };
    const braceStart = tail.indexOf('{');
    if (braceStart < 0) throw new Error('После else ожидается блок { ... }.');
    const braceEnd = findClosingBracket(tail, braceStart);
    if (braceEnd < 0) throw new Error('Не закрыта скобка } в блоке else.');
    return { type: 'block', value: tail.slice(braceStart + 1, braceEnd) };
  }

   /** Выполнить одну строку (до конвейера). */
  function exec(l) {
    if (++depth > 200) throw new Error('Превышена максимальная глубина вложенности (200). Проверьте рекурсию.');
    try {
    l = l.trim();
    if (!l) return [];
    let m;

    // Функция: function Hello($n) { ... }
    if (/^function\b/i.test(l)) {
      const fnMatch = l.match(/^function\s+([A-Za-z_][\w-]*)/i);
      if (!fnMatch) throw new Error('Некорректное объявление функции.');
      const name = fnMatch[1];
      const afterName = l.slice(fnMatch[0].length).trim();
      let paramsText = '';
      let bodyOffset = 0;
      const openParen = afterName.indexOf('(');
      if (openParen === 0) {
        const closeParen = findMatchingPair(afterName, openParen, '(', ')');
        if (closeParen < 0) throw new Error('Не закрыта скобка ) в объявлении функции.');
        paramsText = afterName.slice(openParen + 1, closeParen);
        bodyOffset = closeParen + 1;
      }
      const braceStart = afterName.indexOf('{', bodyOffset);
      if (braceStart < 0) throw new Error('Не найден блок { ... } в функции.');
      const braceEnd = findClosingBracket(afterName, braceStart);
      if (braceEnd < 0) throw new Error('Не закрыта скобка } в функции.');
      const body = afterName.slice(braceStart + 1, braceEnd);
      const rawParams = paramsText ? paramsText.split(',').map(x => x.trim()).filter(Boolean) : [];
      const parsedParams = rawParams.map(parseParamSpec).filter(Boolean);
      FN[name.toLowerCase()] = {
        p: parsedParams.map(p => p.name),
        params: parsedParams,
        b: body
      };
      return [];
    }

    // try/catch/finally
    if (/^try\s*\{/i.test(l)) return runTry(l);

    // throw
    if ((m = l.match(/^throw\s+([\s\S]+)$/i))) throw new Error(String(evalExpr(m[1])));

    // return
    if ((m = l.match(/^return(?:\s+([\s\S]+))?$/i))) {
      const r = m[1] ? exec(m[1]) : [];
      throw new ReturnSignal(r);
    }

    // while
    if (/^while\b/i.test(l)) {
      const block = parseControlBlock(l, 'while');
      if (!block) throw new Error('Некорректный синтаксис while.');
      const out = [];
      let n = 0;
      while (evalExpr(block.condition)) {
        if (++n > 10000) throw new Error('Превышен лимит итераций while (10 000). Проверьте условие цикла.');
        out.push(...runMultiline(block.body));
      }
      return out;
    }

    // for
    if (/^for\b/i.test(l)) {
      const block = parseControlBlock(l, 'for');
      if (!block) throw new Error('Некорректный синтаксис for.');
      const out = [];
      const parts = splitBracketed(block.condition, ';');
      const init = parts[0] ? parts[0].trim() : '';
      const cond = parts[1] ? parts[1].trim() : '';
      const step = parts[2] ? parts[2].trim() : '';
      if (init) exec(init);
      let n = 0;
      while (!cond || evalExpr(cond)) {
        if (++n > 10000) throw new Error('Превышен лимит итераций for (10 000). Проверьте условие цикла.');
        out.push(...runMultiline(block.body));
        if (step) exec(step);
      }
      return out;
    }

    // foreach ($x in collection) { ... }
    if (/^foreach\b/i.test(l)) {
      const block = parseControlBlock(l, 'foreach');
      if (!block) throw new Error('Некорректный синтаксис foreach.');
      const condition = block.condition.trim();
      const inIndex = condition.search(/\s+in\s+/i);
      if (inIndex < 0) throw new Error('В foreach ожидается выражение "in".');
      const variable = condition.slice(0, inIndex).trim().replace(/^\$/, '').toLowerCase();
      const source = condition.slice(inIndex + 3).trim();
      const out = [];
      for (const x of exec(source)) {
        V[variable] = x;
        out.push(...runMultiline(block.body));
      }
      return out;
    }

    // if (...) { ... } else { ... }
    if (/^if\b/i.test(l)) {
      const block = parseControlBlock(l, 'if');
      if (!block) throw new Error('Некорректный синтаксис if.');
      const conditionResult = !!evalExpr(block.condition);
      const elseBranch = readElseBranch(block.rest);
      if (conditionResult) {
        const out = runMultiline(block.body);
        if (!elseBranch) return out;
        return out;
      }
      if (!elseBranch) return [];
      if (elseBranch.type === 'if') return exec(elseBranch.value);
      return runMultiline(elseBranch.value);
    }

    // $var++ / -- / += / -= etc.
    if ((m = l.match(/^\$(\w+)\s*(\+\+|--|\+=|-=|\*=|\/=)\s*([\s\S]*)$/))) {
      const k = m[1].toLowerCase(), op = m[2];
      const old = Number(V[k] ?? 0);
      const delta = m[3].trim() ? Number(evalExpr(m[3])) : 1;
      const ops = { '++': () => old + 1, '--': () => old - 1, '+=': () => old + delta, '-=': () => old - delta, '*=': () => old * delta, '/=': () => old / delta };
      V[k] = ops[op] ? ops[op]() : old;
      return [];
    }

    // $var = значение
    if ((m = l.match(/^\$(\w+)\s*=\s*([^=][\s\S]*)$/))) {
      const r = exec(m[2]);
      V[m[1].toLowerCase()] = r.length === 1 ? r[0] : r;
      return [];
    }

    // Конвейер: команда | команда | ...
    let d = null;
    for (const s of splitBracketed(l, '|')) {
      if (s.trim()) d = pipelineStage(s.trim(), d);
    }
    return d || [];
    } finally {
      depth--;
    }
  }

  /** Выполнить команду (много строк разрешено). */
  function run(command) {
    CAUGHT = false;
    const results = runMultiline(command);
    return results;
  }

  /** Получить состояние try/catch для проверки заданий. */
  function wasCaught() { return CAUGHT; }

  /** Получить переменные (для task-checker). */
  function getVars() { return V; }

  /** Получить пользовательские функции (для task-checker). */
  function getFns() { return FN; }

  /** Сбросить состояние. */
  function reset() {
    for (const k of Object.keys(V)) delete V[k];
    for (const k of Object.keys(FN)) delete FN[k];
    CUR = null;
    CAUGHT = false;
    depth = 0;
  }

  return {
    run,
    wasCaught,
    getVars,
    getFns,
    reset,
    getV: () => V,
    getFN: () => FN
  };
}
