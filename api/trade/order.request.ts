import { Api } from "../..";
import { PaginationQuery } from "../../models/pagination";

export interface OrderListQuery extends PaginationQuery {
  /** 판매처 */
  srcCompanyId: number;
  /** 구매처 */
  dstCompanyId: number;
}

export interface OrderStockCreateRequest {
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

export interface OrderStockUpdateRequest {
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

export interface OrderStockArrivalListQuery extends PaginationQuery {}

export interface OrderStockArrivalCreateRequest {
  warehouseId: number | null;
  productId: number;
  packagingId: number;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroupId?: number | null;
  paperColorId?: number | null;
  paperPatternId?: number | null;
  paperCertId?: number | null;
  quantity: number;
  stockPrice: Api.StockCreateStockPriceRequest;
}
