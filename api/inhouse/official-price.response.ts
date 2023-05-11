import { OfficialPriceCondition } from "../../models";
import { PaginationResponse } from "../../models/pagination";

/** 고시가 목록 */
export type OfficialPriceListResponse = PaginationResponse<OfficialPriceCondition>;

/** 고시가 상세 */
export type OfficialPriceResponse = OfficialPriceCondition;