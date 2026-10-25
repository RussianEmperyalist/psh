/**
 * Проверка выполнения заданий.
 * Получает текущий урок, историю команд, результат и состояние среды.
 * Возвращает { passed, message }.
 */

import { flattenLessons } from '../course/course-data.js';

const LS = flattenLessons();

/**
 * Проверить задание текущего урока.
 * @param {number} lessonIndex — индекс текущего урока
 * @param {string[]} history — все введённые команды
 * @param {string} outText — форматированный вывод последней команды
 * @param {Array} result — массив объектов из последней команды
 * @param {object} interp — интерпретатор (для доступа к V, FN, wasCaught)
 * @param {object} env — виртуальная среда { svcs, ... }
 * @returns {{ passed: boolean, message: string }}
 */
export function checkTask(lessonIndex, history, outText, result, interp, env) {
  if (lessonIndex < 0 || lessonIndex >= LS.length) {
    return { passed: false, message: 'Нет такого задания.' };
  }

  const lastCmd = history.length ? history[history.length - 1].toLowerCase() : '';
  const historyText = history.join('\n');
  const has = (re) => re.test(historyText);
  const lastHas = (re) => re.test(lastCmd);
  const V = interp.getVars();
  const FN = interp.getFns();

  const checks = [
    // 0: Командлеты и справка
    () => lastHas(/get-help\s+get-service/) && /Get-Service|служб/i.test(outText),

    // 1: Конвейер и объекты
    () => lastHas(/select(-object)?\b.*-first\s+3/) && result.length === 3 && result.every(x => x && x.CPU !== undefined) && result.every((x, j, a) => !j || a[j - 1].CPU >= x.CPU),

    // 2: Фильтрация
    () => lastHas(/where(-object)?/) && result.length > 0 && result.every(x => Number(x.CPU) > 50),

    // 3: Переменные и массивы
    () => has(/\$svc\s*=.*get-service/i) && Array.isArray(V.svc) && V.svc.every(x => x.Status === 'Running') && lastHas(/\$svc\.count/i) && Number(outText.trim()) === V.svc.length,

    // 4: Файлы и папки
    () => has(/(set-content|sc)\s+hello\.txt/i) && lastHas(/(get-content|cat|type|gc)\s+hello\.txt/i) && outText.trim().length > 0,

    // 5: Условия и циклы
    () => lastHas(/foreach\s*\(\s*\$\w+\s+in\s+1\.\.5/i) && result.map(String).join(',') === '1,2,3,4,5',

    // 6: Поиск по тексту и логам
    () => lastHas(/select-string/i) && /ERROR/i.test(outText) && outText.split('\n').filter(x => /ERROR/i.test(x)).length >= 2,

    // 7: Службы и процессы
    () => has(/stop-service\s+(-name\s+)?spooler/i) && lastHas(/get-service/i) && env.svcs.find(x => x.Name === 'Spooler')?.Status === 'Stopped' && result.some(x => x.Status === 'Stopped'),

    // 8: Учётные записи
    () => lastHas(/get-localuser/) && result.length > 0 && result.every(x => x.Enabled === true),

    // 9: Журналы событий
    () => lastHas(/measure(-object)?/) && result.length === 1 && Number(result[0].Count) >= 1 && has(/4625/i),

    // 10: Хэш-таблицы
    () => has(/\$h\s*=\s*@\{/i) && V.h && V.h.Host !== undefined && V.h.Port !== undefined && lastHas(/\$h(\.port|\[["']port["']\])/i) && outText.trim() === String(V.h.Port),

    // 11: Функции
    () => Object.keys(FN).some(n => {
      const name = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp('function\\s+' + name + '\\b|\\b' + name + '\\s*\\(', 'i').test(historyText);
    }) && lastHas(/^[a-z_][\w-]*(?:\s|$)/i) && outText.trim().length > 0 && result.length > 0,

    // 12: Обработка ошибок
    () => interp.wasCaught() && /^try\s*\{/i.test(lastCmd) && /catch/i.test(lastCmd) && outText.trim().length > 0,

    // 13: Подозрительные соединения
    () => lastHas(/get-process\s+-id/) && result.some(x => x.Id === 6666) && has(/4444/),

    // 14: Целостность и политики
    () => has(/get-filehash/i) && lastHas(/get-executionpolicy/i) && outText.trim() === env.getExecutionPolicy(),

    // 15: Поиск секретов
    () => lastHas(/select-string/i) && /password/i.test(outText) && /get-childitem[\s\S]*recurse[\s\S]*select-string/i.test(historyText)
  ];

  let passed = false;
  try {
    passed = !!checks[lessonIndex] && checks[lessonIndex]();
  } catch (e) {
    passed = false;
  }

  if (passed) {
    return { passed: true, message: 'Задание выполнено ✓' };
  }

  // Подобрать подсказку
  const lesson = LS[lessonIndex];
  if (lesson && lesson.h) {
    return { passed: false, message: 'Попробуйте: ' + lesson.h };
  }

  return { passed: false, message: 'Попробуйте другую команду.' };
}
