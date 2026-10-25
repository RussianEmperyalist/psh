/**
 * Виртуальные процессы.
 * Каждый процесс: { Name, Id, CPU, WS }
 */
import { proxyWrap } from './filesystem.js';

export function createProcesses() {
  const data = [
    ['svchost', 812, 12.4, 48],
    ['chrome', 4120, 356.2, 612],
    ['explorer', 2210, 88.7, 140],
    ['powershell', 5012, 3.1, 72],
    ['lsass', 712, 9.8, 22],
    ['MsMpEng', 3340, 210.5, 260],
    ['spoolsv', 1544, 1.2, 18],
    ['updater', 6666, 70.2, 35]
  ];
  return data.map(([Name, Id, CPU, WS]) => proxyWrap({ Name, Id, CPU, WS }));
}
