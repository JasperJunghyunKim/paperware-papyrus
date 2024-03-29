import { PaginationQuery } from '../../models/pagination';

export type PlanListQuery = PaginationQuery;

export interface PlanCreateRequest {
  productId: number;
  packagingId: number;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroupId: number;
  paperColorId: number;
  paperPatternId: number;
  paperCertId: number;
  warehouseId: number;
  memo: string;
  quantity: number;
}

export interface RegisterInputStockRequest {
  stockId: number;
  quantity: number;
}

export interface PlanInputListQuery extends PaginationQuery {}
