import DiscountRateCondition from "../../models/discount-rate-condition";
import { Partner } from "../../models";
import { PaginationResponse } from "../../models/pagination";

/** 할인율 거래처 목록 */
export interface DiscountRatePartner {
    partner: Partner;
    discountRatecount: number;
}

export type DisocuntRatePartnerListResponse = PaginationResponse<DiscountRatePartner>;

/** 할인율 목록 */
export type DiscountRateListResponse = PaginationResponse<DiscountRateCondition>;

/** 할인율 상세 */
export type DiscountRateResponse = DiscountRateCondition;