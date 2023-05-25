import { Model } from 'src/@shared';
import { PartnerStockGroup, Stock, StockGroup } from '../../models';
import { PaginationResponse } from '../../models/pagination';

/** 재고그룹 목록 조회 */
export type StockGroupListResponse = PaginationResponse<StockGroup>;

/** 자사 자식재고 목록 조회 */
export type StockListResponse = PaginationResponse<Stock>;

/** 자사 재고 상세 */
export type StockDetailResponse = Stock;

/** 거래처 재고그룹 목록 조회 */
export type PartnerStockGroupListResponse =
  PaginationResponse<PartnerStockGroup>;

export type StockGroupResponse = Model.StockGroup;
