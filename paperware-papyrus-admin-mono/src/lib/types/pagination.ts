export interface PaginationResponse<T> {
  items: T[];
  total: number;
}

export interface PaginationQuery {
  skip?: number;
  take?: number;
}
