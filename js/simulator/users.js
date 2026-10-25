/**
 * Виртуальные учётные записи.
 * Каждая запись: { Name, Enabled, LastLogon, Description }
 */
import { proxyWrap } from './filesystem.js';

export function createUsers() {
  const data = [
    ['Admin', true, 'сегодня', 'Администратор'],
    ['Guest', false, 'никогда', 'Гостевая запись'],
    ['svc_backup', true, '3 дня назад', 'Служба резервного копирования'],
    ['j.ivanov', true, 'вчера', 'Иванов И.'],
    ['tempuser', false, '90 дней назад', 'Временная']
  ];
  return data.map(([Name, Enabled, LastLogon, Description]) =>
    proxyWrap({ Name, Enabled, LastLogon, Description })
  );
}
