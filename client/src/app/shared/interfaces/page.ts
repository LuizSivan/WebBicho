export interface Page<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
