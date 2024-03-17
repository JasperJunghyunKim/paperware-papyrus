export interface PaginationResponse<T> {
  items: Array<T>;
  total: number;
}

export interface PaginationQuery {
  skip: number;
  take: number;
}
