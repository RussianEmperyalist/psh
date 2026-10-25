/**
 * Виртуальные службы.
 * Каждая служба: { Name, Status, DisplayName, StartType }
 */
import { proxyWrap } from './filesystem.js';

export function createServices() {
  const data = [
    ['Spooler', 'Running', 'Print Spooler', 'Automatic'],
    ['WinDefend', 'Running', 'Microsoft Defender', 'Automatic'],
    ['EventLog', 'Running', 'Windows Event Log', 'Automatic'],
    ['TermService', 'Running', 'Remote Desktop', 'Automatic'],
    ['wuauserv', 'Stopped', 'Windows Update', 'Manual'],
    ['RemoteRegistry', 'Stopped', 'Remote Registry', 'Disabled']
  ];
  return data.map(([Name, Status, DisplayName, StartType]) =>
    proxyWrap({ Name, Status, DisplayName, StartType })
  );
}
