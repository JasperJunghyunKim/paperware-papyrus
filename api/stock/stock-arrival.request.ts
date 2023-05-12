import { PaginationQuery } from '../../models/pagination';

export type StockArrivalListQuery = PaginationQuery;

export interface StockArrivalApplyRequest {
    warehouseId: number;
}