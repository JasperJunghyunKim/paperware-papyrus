import { PaginationQuery } from 'src/@shared/models/pagination';

export interface WarehouseListQuery extends PaginationQuery {}

export interface WarehouseCreateRequest {
  name: string;
  code: string;
  isPublic: boolean;
  address: string;
}

export interface WarehouseUpdateRequest extends WarehouseCreateRequest {}
