import { PaginationQuery } from '../../models/pagination';

export interface OrderListQuery extends PaginationQuery {}

export interface OrderCreateRequest {
  srcCompanyId: number;
  dstCompanyId: number;
  locationId: number;
  memo: string;
  wantedDate: string;
  productId: number;
  packagingId: number;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroupId: number | null;
  paperColorId: number | null;
  paperPatternId: number | null;
  paperCertId: number | null;
  quantity: number;
}
