import type { Proxy } from './proxy';

export type SortCriterion = 'latency' | 'status' | 'type' | 'country' | null;
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  criterion: SortCriterion;
  direction: SortDirection;
}

export const STATUS_PRIORITY: Record<Proxy['status'], number> = {
  online: 1,
  checking: 2,
  unchecked: 3,
  offline: 4
};
