/**
 * Журнал событий Windows (виртуальный).
 * События с Id: 4624 (успешный вход), 4625 (неудачный), 4688 (процесс), 7045 (установка службы).
 */
import { proxyWrap } from './filesystem.js';

const MSG = {
  4624: 'Успешный вход',
  4625: 'Неудачный вход',
  4688: 'Создан процесс',
  4672: 'Особые привилегии',
  7045: 'Установлена служба'
};

export function createEvents() {
  const ids = [4624, 4625, 4625, 4688, 4625, 4672, 7045, 4625, 4624, 4625];
  return ids.map((Id, n) => proxyWrap({
    Time: '10:0' + n,
    Id,
    Level: Id === 4625 ? 'Warning' : 'Information',
    Message: MSG[Id]
  }));
}
