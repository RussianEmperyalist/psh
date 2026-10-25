/**
 * Evalutor — вычисление выражений PowerShell.
 * Переменные, подстановка $(...), операторы (-eq, -gt, -like, -match и т.д.),
 * хэш-таблицы, диапазоны, массивы.
 */

/** Операторы like / notlike / match / notmatch / contains / in */
export const comparisonOps = {
  like(s, p) {
    const re = new RegExp(
      '^' + String(p).replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.') + '$', 'i'
    );
    return re.test(s);
  },
  notlike(s, p) { return !this.like(s, p); },
  match(s, p) { return new RegExp(p, 'i').test(s); },
  notmatch(s, p) { return !new RegExp(p, 'i').test(s); },
  contains(a, b) { return [].concat(a).includes(b); },
  in(a, b) { return [].concat(b).includes(a); }
};

/** Сложение строк/чисел */
export function add(a, b) {
  return typeof a === 'string' || typeof b === 'string'
    ? String(a) + String(b)
    : Number(a) + Number(b);
}

/** Вычесть */
export function subtract(a, b) { return Number(a) - Number(b); }

/** Умножить */
export function multiply(a, b) { return Number(a) * Number(b); }

/** Разделить */
export function divide(a, b) { return Number(a) / Number(b); }

/** Остаток */
export function modulo(a, b) { return Number(a) % Number(b); }

/** Диапазон 1..5 */
export function range(from, to) {
  if (Math.abs(to - from) >= 10000) {
    throw new Error('Диапазон слишком большой: в лаборатории максимум 10 000 элементов.');
  }
  const step = from <= to ? 1 : -1;
  const length = Math.abs(to - from) + 1;
  return Array.from({ length }, (_, i) => from + i * step);
}

/** Сравнение свойства объекта по оператору */
export function compareProperty(op, obj, propValue, compareValue) {
  const cmp = {
    eq: () => String(propValue).toLowerCase() === String(compareValue).toLowerCase(),
    ne: () => String(propValue).toLowerCase() !== String(compareValue).toLowerCase(),
    gt: () => propValue > compareValue,
    lt: () => propValue < compareValue,
    ge: () => propValue >= compareValue,
    le: () => propValue <= compareValue,
    like: () => comparisonOps.like(String(propValue), compareValue),
    match: () => new RegExp(String(compareValue), 'i').test(String(propValue)),
    contains: () => [].concat(propValue).includes(compareValue)
  };
  return cmp[op] ? cmp[op]() : false;
}

/** Получить свойство из объекта (case-insensitive). */
export function getProperty(obj, key) {
  if (obj == null) return undefined;
  if (key.toLowerCase() === 'count' && Array.isArray(obj)) return obj.length;
  if (key.toLowerCase() === 'length' && (Array.isArray(obj) || typeof obj === 'string')) return obj.length;
  const found = Object.getOwnPropertyNames(Object(obj)).find(z => z.toLowerCase() === key.toLowerCase());
  return found === undefined ? undefined : obj[found];
}

/** Разделить строку по разделителю, с учётом кавычек и скобок. */
export function splitBracketed(str, sep) {
  const result = [];
  let current = '';
  let quote = '';
  let depth = 0;
  for (const ch of str) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if ('{(['.includes(ch)) {
      depth++;
    } else if ('})]'.includes(ch)) {
      depth--;
    }
    if (ch === sep && depth === 0) {
      result.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result;
}

/** Найти баланс скобок от позиции start. */
export function findClosingBracket(str, start) {
  let depth = 0;
  let quote = '';
  for (let i = start; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}' && --depth === 0) {
      return i;
    }
  }
  return -1;
}

/** Проверить, что строка полностью сбалансирована в скобках. */
export function isBalancedOuter(str) {
  if (str[0] !== '(' || str[str.length - 1] !== ')') return false;
  let depth = 0;
  let quote = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth--;
      if (depth === 0 && i < str.length - 1) return false;
    }
  }
  return depth === 0;
}

/** Разделить выражение по оператору (с учётом приоритета). */
export function splitByOperator(str, ops, lastOnly) {
  let quote = '';
  let depth = 0;
  let found = null;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if ('([{'.includes(ch)) {
      depth++;
    } else if (')]}'.includes(ch)) {
      depth--;
    }
    if (depth !== 0) continue;
    for (const op of ops) {
      const slice = str.slice(i, i + op.length);
      if (slice.toLowerCase() === op.toLowerCase() &&
        (op === '-' || op[0] !== '-' || i === 0 || /\s/.test(str[i - 1])) &&
        (op === '-' || op[0] !== '-' || i + op.length === str.length || /\s/.test(str[i + op.length]))) {
        const parts = [str.slice(0, i).trim(), op.toLowerCase(), str.slice(i + op.length).trim()];
        if (!lastOnly) return parts;
        found = parts;
      }
    }
  }
  return found;
}
