/**
 * Реализация командлетов PowerShell.
 * Каждый командлет: function(args, inputArray) { ... }
 * args._ — позиционные аргументы, args.n — именованные параметры.
 */

import { readFile, writeFile, resolvePath, listDirectory, findKey, pathToString } from '../simulator/filesystem.js';
import { getExecutionPolicy, setExecutionPolicy } from '../simulator/policies.js';
import { comparisonOps } from './evaluator.js';

/** Получить значение параметра: именованный или позиционный. */
function g(args, key, defaultPos) {
  if (args.n[key] !== undefined) return args.n[key];
  if (args._[defaultPos] !== undefined) return args._[defaultPos];
  return undefined;
}

/** Найти службу по имени. */
function findService(svcs, args) {
  const name = g(args, 'name', 0);
  const found = svcs.find(s => s.Name.toLowerCase() === String(name).toLowerCase());
  if (!found) throw new Error(`Не удаётся найти службу "${name}".`);
  return found;
}

/** Справка для Get-Help */
const HELP = {
  'Get-Process': ['Показывает запущенные процессы.', 'Get-Process -Name chrome'],
  'Get-Service': ['Показывает службы Windows.', 'Get-Service -Name Spooler'],
  'Where-Object': ['Фильтрует объекты по условию.', 'Get-Process | Where-Object { $_.CPU -gt 50 }'],
  'Select-Object': ['Выбирает свойства и количество объектов.', 'Get-Process | Select-Object Name,Id -First 3'],
  'Sort-Object': ['Сортирует объекты по свойству.', 'Get-Process | Sort-Object CPU -Descending'],
  'Get-ChildItem': ['Список файлов и папок (ls, dir).', 'Get-ChildItem -Recurse'],
  'Get-Content': ['Читает файл построчно (cat).', 'Get-Content Documents\\Logs\\app.log'],
  'Select-String': ['Ищет текст по шаблону (аналог grep).', 'Select-String -Pattern ERROR -Path Documents\\Logs\\app.log'],
  'Measure-Object': ['Считает количество и статистику.', 'Get-Process | Measure-Object CPU -Sum'],
  'Get-WinEvent': ['Читает журналы событий.', 'Get-WinEvent -MaxEvents 5'],
  'Get-NetTCPConnection': ['Показывает TCP-соединения.', 'Get-NetTCPConnection -State Established'],
  'Get-FileHash': ['Считает хэш файла.', 'Get-FileHash Documents\\notes.txt']
};

let _procs, _svcs, _users, _events, _net, _fsRoot, _cwd, _proxyWrap, _out;

export function initCommands(procs, svcs, users, events, net, fsRoot, cwd, proxyWrap, out) {
  _procs = procs; _svcs = svcs; _users = users; _events = events;
  _net = net; _fsRoot = fsRoot; _cwd = cwd; _proxyWrap = proxyWrap; _out = out;
}

// Кэш командлетов
let _cmds = null;

export function getCommands() {
  if (_cmds) return _cmds;
  _cmds = {

    'Get-Process': (args) => {
      const name = g(args, 'name', 0);
      const id = args.n.id;
      let result = _procs.filter(p =>
        (name == null || p.Name.toLowerCase() === String(name).toLowerCase()) &&
        (id == null || p.Id === id)
      );
      if (!result.length && (name !== undefined || id !== undefined)) {
        throw new Error('Не удаётся найти процесс.');
      }
      return result;
    },

    'Stop-Process': (args) => {
      const name = g(args, 'name', 0);
      const id = args.n.id;
      const target = _procs.filter(p =>
        name != null ? p.Name.toLowerCase() === String(name).toLowerCase() : p.Id === id
      );
      if (!target.length) throw new Error('Не удаётся найти процесс.');
      target.forEach(p => _procs.splice(_procs.indexOf(p), 1));
      return [];
    },

    'Get-Service': (args) => {
      const name = g(args, 'name', 0);
      const result = _svcs.filter(s => name == null || s.Name.toLowerCase() === String(name).toLowerCase());
      if (!result.length) throw new Error(`Не удаётся найти службу "${name}".`);
      return result;
    },

    'Start-Service': (args) => {
      findService(_svcs, args).Status = 'Running';
      return [];
    },

    'Stop-Service': (args) => {
      findService(_svcs, args).Status = 'Stopped';
      return [];
    },

    'Get-LocalUser': () => _users,

    'Get-WinEvent': (args) => {
      return args.n.maxevents ? _events.slice(0, args.n.maxevents) : _events;
    },

    'Get-NetTCPConnection': (args) => {
      return _net.filter(c =>
        ['state', 'remoteport', 'localport', 'owningprocess'].every(k => {
          const key = Object.keys(c).find(x => x.toLowerCase() === k);
          return args.n[k] == null || String(c[key]).toLowerCase() === String(args.n[k]).toLowerCase();
        })
      );
    },

    'Get-ChildItem': (args) => {
      const path = g(args, 'path', 0) || '.';
      const r = resolvePath(_fsRoot, _cwd, path);
      if (!r.node) throw new Error(`Не удаётся найти путь "${path}", так как он не существует.`);
      if (r.node.c) return listDirectory(r.node, r.segments, args.n.recurse);
      return [r.name];
    },

    'Get-Content': (args) => {
      const content = readFile(_fsRoot, _cwd, g(args, 'path', 0));
      return content.split('\n').filter((l, i, arr) => l || i < arr.length - 1);
    },

    'Set-Content': (args) => {
      writeFile(_fsRoot, _cwd, g(args, 'path', 0), [].concat(g(args, 'value', 1) ?? '').join('\n'));
      return [];
    },

    'Add-Content': (args) => {
      writeFile(_fsRoot, _cwd, g(args, 'path', 0), [].concat(g(args, 'value', 1) ?? '').join('\n') + '\n', true);
      return [];
    },

    'New-Item': (args) => {
      let path = g(args, 'path', 0) || '.';
      if (args.n.name) path += '\\' + args.n.name;
      const r = resolvePath(_fsRoot, _cwd, path);
      if (r.node) throw new Error('Элемент уже существует.');
      if (!r.parent || !r.parent.c) throw new Error('Родительский каталог не найден.');
      const isDir = /dir/i.test(args.n.itemtype);
      r.parent.c[r.name] = isDir ? { c: {} } : { f: (args.n.value != null ? args.n.value + '\n' : '') };
      return [_proxyWrap({ Mode: isDir ? 'd-----' : '-a----', Name: r.name })];
    },

    'Remove-Item': (args) => {
      const r = resolvePath(_fsRoot, _cwd, g(args, 'path', 0));
      if (!r.node) throw new Error('Не удаётся найти путь.');
      if (r.node.c && Object.keys(r.node.c).length > 0) {
        throw new Error('Нельзя удалить непустую папку.');
      }
      if (r.segments.length <= 3) throw new Error('Эту папку удалять нельзя: она нужна лаборатории.');
      delete r.parent.c[findKey(r.parent, r.name)];
      return [];
    },

    'Test-Path': (args) => {
      return [!!resolvePath(_fsRoot, _cwd, g(args, 'path', 0)).node];
    },

    'Set-Location': (args) => {
      const path = g(args, 'path', 0) || 'C:\\Users\\Admin';
      const r = resolvePath(_fsRoot, _cwd, path);
      if (!r.node || !r.node.c) throw new Error(`Не удаётся найти путь "${path}".`);
      _cwd.length = 0;
      r.segments.forEach(s => _cwd.push(s));
      return [];
    },

    'Get-Location': () => [_proxyWrap({ Path: pathToString(_cwd) })],

    'Write-Output': (args) => args._.flat(),

    'Write-Host': (args) => {
      _out(args._.flat().join(' '), 'wh');
      return [];
    },

    'Get-Date': () => {
      const d = new Date();
      const t = d.toLocaleString('ru-RU');
      const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      const o = {};
      Object.defineProperties(o, { __s: { value: t }, toString: { value: () => t } });
      const props = { DateTime: t, Year: d.getFullYear(), Month: d.getMonth() + 1, Day: d.getDate(), Hour: d.getHours(), Minute: d.getMinutes(), DayOfWeek: days[d.getDay()] };
      for (const k in props) Object.defineProperty(o, k, { value: props[k] });
      return [_proxyWrap(o)];
    },

    'Clear-Host': () => [],

    'Select-Object': (args, input) => {
      let result = input;
      const props = [].concat(args.n.property ?? [], args._).flat().filter(x => typeof x === 'string');
      if (args.n.first) result = result.slice(0, args.n.first);
      if (args.n.last) result = result.slice(-args.n.last);
      if (args.n.expandproperty) return result.map(x => x[args.n.expandproperty]);
      if (props.length) {
        result = result.map(x => {
          const o = {};
          props.forEach(k => {
            const key = Object.keys(x).find(z => z.toLowerCase() === k.toLowerCase()) || k;
            o[key] = x[key];
          });
          return _proxyWrap(o);
        });
      }
      if (args.n.unique) {
        const seen = new Set();
        result = result.filter(x => {
          const key = props.length ? JSON.stringify(x) : String(x);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
      return result;
    },

    'Sort-Object': (args, input) => {
      const key = g(args, 'property', 0);
      const fn = x => key ? x[key] : x;
      const dir = args.n.descending ? -1 : 1;
      return [...input].sort((x, y) => (fn(x) > fn(y) ? 1 : fn(x) < fn(y) ? -1 : 0) * dir);
    },

    'Measure-Object': (args, input) => {
      const prop = g(args, 'property', 0);
      const obj = { Count: input.length };
      if (prop) {
        const vals = input.map(x => +x[prop]);
        const sum = vals.reduce((a, b) => a + b, 0);
        Object.assign(obj, {
          Average: +((sum / vals.length).toFixed(2)),
          Sum: +sum.toFixed(2),
          Maximum: Math.max(...vals),
          Minimum: Math.min(...vals),
          Property: prop
        });
      }
      return [_proxyWrap(obj)];
    },

    'Group-Object': (args, input) => {
      const key = g(args, 'property', 0);
      const map = {};
      input.forEach(x => { map[x[key]] = (map[x[key]] || 0) + 1; });
      return Object.entries(map).map(([Name, Count]) => _proxyWrap({ Count, Name }));
    },

    'Get-Member': (args, input) => {
      if (!input.length) throw new Error('Нет объектов для Get-Member.');
      return Object.getOwnPropertyNames(input[0])
        .filter(k => k !== '__s' && k !== '__ht' && k !== 'toString')
        .map(k => _proxyWrap({ Name: k, MemberType: 'Property', Type: typeof input[0][k] }));
    },

    'Format-Table': (args, input) => args._.length ? _cmds['Select-Object'](args, input) : input,

    'Format-List': (args, input) => [{
      __txt: input.map(x => Object.keys(x).map(k => k.padEnd(14) + ': ' + x[k]).join('\n')).join('\n\n')
    }],

    'ConvertTo-Json': (args, input) => [{
      __txt: JSON.stringify(input.length === 1 ? input[0] : input, null, 2)
    }],

    'Select-String': (args, input) => {
      const pattern = g(args, 'pattern', 0);
      let re;
      try {
        re = new RegExp(args.n.simplematch ? String(pattern).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : pattern, 'i');
      } catch (e) {
        throw new Error('Неверный шаблон поиска.');
      }
      const src = args.n.path
        ? [[args.n.path, readFile(_fsRoot, _cwd, args.n.path).split('\n')]]
        : input.some(x => x && x.FullName)
          ? input.filter(x => x.FullName && x.Mode[0] !== 'd').map(x => [x.FullName, readFile(_fsRoot, _cwd, x.FullName).split('\n')])
          : [['', input.map(String)]];
      return src.flatMap(([file, lines]) =>
        lines.map((s, n) => [s, n]).filter(([s]) => s && re.test(s)).map(([s, n]) =>
          file ? `${file}:${n + 1}:${s}` : s
        )
      );
    },

    'Get-FileHash': (args) => {
      const path = g(args, 'path', 0);
      const text = readFile(_fsRoot, _cwd, path);
      let h = 2166136261;
      const hashes = [];
      for (let k = 0; k < 8; k++) {
        for (const ch of text + k) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
        hashes.push((h >>> 0).toString(16).padStart(8, '0'));
      }
      return [_proxyWrap({
        Algorithm: 'EDU-FNV',
        Hash: hashes.join('').toUpperCase(),
        Path: pathToString(resolvePath(_fsRoot, _cwd, path).segments),
        Note: 'Учебный отпечаток; не является криптографическим SHA-256'
      })];
    },

    'Get-ExecutionPolicy': () => [getExecutionPolicy()],

    'Set-ExecutionPolicy': (args) => {
      setExecutionPolicy(args._[0]);
      return [];
    },

    'Where-Object': (args, input) => input || [],
    'ForEach-Object': (args, input) => input || [],

    'Get-Command': (args) => {
      const pattern = g(args, 'name', 0);
      const all = Object.keys(_cmds).filter(k => k.includes('-'));
      if (pattern) return all.filter(k => comparisonOps.like(k, pattern)).sort();
      return all.sort();
    },

    'Get-Help': (args) => {
      const name = String(g(args, 'name', 0) || 'Get-Help');
      const key = Object.keys(_cmds).find(c => c.toLowerCase() === name.toLowerCase());
      if (!key) throw new Error(`Справка по "${name}" не найдена. Попробуйте Get-Command.`);
      const h = HELP[key] || ['Описание смотрите в уроках курса.', key];
      return [{
        __txt: `ИМЯ\n    ${key}\n\nОПИСАНИЕ\n    ${h[0]}\n\nПРИМЕР\n    PS> ${h[1]}`
      }];
    }
  };
  return _cmds;
}
