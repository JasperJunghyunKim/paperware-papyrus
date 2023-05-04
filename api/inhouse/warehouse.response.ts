import { Warehouse } from 'src/@shared/models';
import { PaginationResponse } from 'src/@shared/models/pagination';

export interface WarehouseListResponse extends PaginationResponse<Warehouse> {}
