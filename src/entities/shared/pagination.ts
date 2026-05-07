export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: PaginationMeta;
};
