import { PaginationQuery } from '../../models/pagination';

export interface OrderListQuery extends PaginationQuery {}

export interface OrderCreateRequest {
  srcCompanyId: number;
  dstCompanyId: number;
  locationId: number;
  memo: string;
  wantedDate: string;
  stockGroupId: number;
  quantity: number;
}
