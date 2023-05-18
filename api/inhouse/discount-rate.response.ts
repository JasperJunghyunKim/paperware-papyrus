import DiscountRateCondition from "src/@shared/models/discount-rate-condition";
import { PaginationResponse } from "src/@shared/models/pagination";

/** 할인율 목록 */
export type DiscountRateListResponse = PaginationResponse<DiscountRateCondition>;

/** 할인율 상세 */
export type DiscountRateResponse = DiscountRateCondition;