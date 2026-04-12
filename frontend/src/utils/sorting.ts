import type { Proxy } from '../types/proxy';
import type { SortState } from '../types/sort';
import { STATUS_PRIORITY } from '../types/sort';

export function compareLatency(a: Proxy, b: Proxy): number {
  // null значения всегда в конце
  if (a.latency === null && b.latency === null) return 0;
  if (a.latency === null) return 1;
  if (b.latency === null) return -1;
  
  return a.latency - b.latency;
}

export function compareStatus(a: Proxy, b: Proxy): number {
  const priorityA = STATUS_PRIORITY[a.status];
  const priorityB = STATUS_PRIORITY[b.status];
  
  return priorityA - priorityB;
}

export function compareType(a: Proxy, b: Proxy): number {
  return a.type.localeCompare(b.type);
}

export function compareCountry(a: Proxy, b: Proxy): number {
  // null значения всегда в конце
  if (a.country === null && b.country === null) return 0;
  if (a.country === null) return 1;
  if (b.country === null) return -1;
  
  return a.country.localeCompare(b.country);
}

export function sortProxies(proxies: Proxy[], sortState: SortState): Proxy[] {
  if (!sortState.criterion) return proxies;
  
  if (!proxies || proxies.length === 0) {
    return [];
  }
  
  const sorted = [...proxies].sort((a, b) => {
    let comparison = 0;
    
    switch (sortState.criterion) {
      case 'latency':
        comparison = compareLatency(a, b);
        break;
      case 'status':
        comparison = compareStatus(a, b);
        break;
      case 'type':
        comparison = compareType(a, b);
        break;
      case 'country':
        comparison = compareCountry(a, b);
        break;
      default:
        console.warn('Invalid sort criterion:', sortState.criterion);
        return 0;
    }
    
    return sortState.direction === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}
