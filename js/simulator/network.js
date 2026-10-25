/**
 * Виртуальные TCP-соединения.
 * { LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess }
 */
import { proxyWrap } from './filesystem.js';

export function createNetworkConnections() {
  const data = [
    ['192.168.1.15', 50122, '93.184.216.34', 443, 'Established', 4120],
    ['192.168.1.15', 50301, '185.220.101.5', 4444, 'Established', 6666],
    ['0.0.0.0', 3389, '0.0.0.0', 0, 'Listen', 1544],
    ['0.0.0.0', 445, '0.0.0.0', 0, 'Listen', 4]
  ];
  return data.map(([LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess]) =>
    proxyWrap({ LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess })
  );
}
