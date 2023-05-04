export interface PaginationResponse<T> {
  items: Array<T>;
  total: number;
}

export interface PaginationQuery {
  skip: string;
  take: string;
}
