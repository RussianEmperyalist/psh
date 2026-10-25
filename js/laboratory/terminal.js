/**
 * Терминал лаборатории — DOM-обёртка для ввода/вывода.
 */

import { createInterpreter } from '../powershell/interpreter.js';
import { initCommands, getCommands } from '../powershell/commands.js';
import { formatOutput } from '../powershell/formatter.js';
import { proxyWrap, pathToString } from '../simulator/filesystem.js';
import { createProcesses } from '../simulator/processes.js';
import { createServices } from '../simulator/services.js';
import { createUsers } from '../simulator/users.js';
import { createEvents } from '../simulator/events-log.js';
import { createNetworkConnections } from '../simulator/network.js';
import { getExecutionPolicy, resetExecutionPolicy } from '../simulator/policies.js';
import { createFilesystem } from '../simulator/filesystem.js';
import { createHistory } from './history.js';

export function createTerminal(options) {
  const { outputEl, inputEl, promptEl, onAfterExec } = options;

  // Виртуальная среда
  let procs = createProcesses();
  let svcs = createServices();
  let users = createUsers();
  let events = createEvents();
  let net = createNetworkConnections();
  let fsRoot = createFilesystem();
  let cwd = ['C:', 'Users', 'Admin'];

  // Функция вывода (используется командлетами Write-Host и Clear-Host)
  const MAX_OUTPUT_NODES = 5000;
  function out(text, cssClass) {
    const div = document.createElement('div');
    div.className = cssClass || '';
    div.textContent = text;
    outputEl.append(div);
    outputEl.scrollTop = outputEl.scrollHeight;
    if (outputEl.childElementCount > MAX_OUTPUT_NODES) {
      while (outputEl.childElementCount > MAX_OUTPUT_NODES / 2) {
        outputEl.removeChild(outputEl.firstChild);
      }
      const trimDiv = document.createElement('div');
      trimDiv.className = 'er';
      trimDiv.textContent = '… вывод обрезан (более 5000 строк)';
      outputEl.insertBefore(trimDiv, outputEl.firstChild);
    }
  }

  // Инициализация командлетов с env
  initCommands(procs, svcs, users, events, net, fsRoot, cwd, proxyWrap, out);

  // Интерпретатор
  const interp = createInterpreter({
    proxyWrap,
    strObj(s, props) {
      const o = {};
      Object.defineProperties(o, {
        __s: { value: s },
        toString: { value: () => s }
      });
      for (const k in props) Object.defineProperty(o, k, { value: props[k] });
      return proxyWrap(o);
    }
  });

  // История команд
  const history = createHistory();

  // Обновить промпт
  function updatePrompt() {
    if (promptEl) {
      promptEl.textContent = 'PS ' + pathToString(cwd) + '>';
    }
  }

  // Выполнить команду
  function exec(line) {
    line = line.trim();
    if (!line) return;

    // Показать команду в выводе
    out((promptEl ? promptEl.textContent : 'PS>') + ' ' + line, 'cm');

    // Добавить в историю
    history.push(line);

    try {
      const commandName = line.split(/\s+/)[0].toLowerCase();
      if (['clear-host', 'cls', 'clear'].includes(commandName)) {
        clearOutput();
        if (onAfterExec) {
          onAfterExec(line, history.all(), '', []);
        }
        return;
      }

      const results = interp.run(line);
      const text = formatOutput(results, proxyWrap);
      if (text) out(text);
      if (onAfterExec) {
        onAfterExec(line, history.all(), text, results);
      }
    } catch (e) {
      const msg = e instanceof RangeError
        ? 'Слишком глубокая рекурсия или слишком большой объём данных.'
        : e && e.message ? e.message : 'Ошибка выполнения команды';
      out(msg, 'er');
    }

    updatePrompt();
  }

  // Обработчик ввода
  if (inputEl) {
    inputEl.onkeydown = (e) => {
      if (e.key === 'Enter') {
        exec(inputEl.value);
        inputEl.value = '';
      } else if (e.key === 'ArrowUp') {
        inputEl.value = history.prev();
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        inputEl.value = history.next();
      } else if (e.key === 'l' && e.ctrlKey) {
        outputEl.innerHTML = '';
        e.preventDefault();
      }
    };
  }

  // Очистить вывод
  function clearOutput() {
    outputEl.innerHTML = '';
  }

  // Полный сброс лаборатории
  function resetLab() {
    procs = createProcesses();
    svcs = createServices();
    users = createUsers();
    events = createEvents();
    net = createNetworkConnections();
    fsRoot = createFilesystem();
    cwd = ['C:', 'Users', 'Admin'];
    resetExecutionPolicy();
    interp.reset();
    history.reset();
    clearOutput();
    updatePrompt();
    initCommands(procs, svcs, users, events, net, fsRoot, cwd, proxyWrap, out);
  }

  updatePrompt();

  return {
    exec,
    clearOutput,
    resetLab,
    updatePrompt,
    getHistory: () => history.all(),
    getInterp: () => interp,
    getEnv: () => ({ procs, svcs, users, events, net, fsRoot, cwd, getExecutionPolicy: () => getExecutionPolicy() }),
    out
  };
}
