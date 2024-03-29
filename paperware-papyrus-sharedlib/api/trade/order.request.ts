import { DepositType, DiscountType, OfficialPriceType, PriceUnit } from '../../models/enum';
import { Api } from '../..';
import { PaginationQuery } from '../../models/pagination';

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
  warehouseId: number | null;
  orderStockId: number | null;
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
  warehouseId: number | null;
  orderStockId: number | null;
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

export interface OrderStockArrivalListQuery extends PaginationQuery { }

export interface OrderStockArrivalCreateRequest {
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
  isSyncPrice: boolean;
  stockPrice: Api.StockCreateStockPriceRequest;
}

/** 거래금액 수정 */
export interface OrderStockTradeAltBundleUpdateRequest {
  altSizeX: number;
  altSizeY: number;
  altQuantity: number;
}

export interface OrderStockTradePriceUpdateRequest {
  officialPriceType: OfficialPriceType;
  officialPrice: number;
  officialPriceUnit: PriceUnit;
  discountType: DiscountType;
  discountPrice: number;
  unitPrice: number;
  unitPriceUnit: PriceUnit;
  processPrice: number;
  orderStockTradeAltBundle?: OrderStockTradeAltBundleUpdateRequest;
}

export interface TradePriceUpdateRequest {
  orderId: number;
  companyId: number;
  suppliedPrice: number;
  vatPrice: number;
  orderStockTradePrice?: OrderStockTradePriceUpdateRequest;
}

/** 보관 등록 */
export interface OrderDepositCreateRequest {
  srcCompanyId: number;
  dstCompanyId: number;
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
}