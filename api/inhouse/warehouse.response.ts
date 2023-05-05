import { Warehouse } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type WarehouseListResponse = PaginationResponse<Warehouse>;
export type WarehouseItemResponse = Warehouse;
