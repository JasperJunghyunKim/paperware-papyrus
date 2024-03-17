import { PaginationQuery } from '../../models/pagination';

export type WarehouseListQuery = PaginationQuery;

export interface WarehouseCreateRequest {
  name: string;
  code: string;
  isPublic: boolean;
  address: string;
}

export type WarehouseUpdateRequest = WarehouseCreateRequest;
