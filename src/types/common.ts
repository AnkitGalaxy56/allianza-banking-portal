export interface Paginated<T> {
  items: T[];
  total: number;
  page: number; // 1-based
  pageSize: number;
}

export type RequestStatus = 'new' | 'in_review' | 'completed' | 'rejected';
