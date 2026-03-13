export interface PaginatedList<TItem> {
  items: TItem[];
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
