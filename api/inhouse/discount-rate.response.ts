import DiscountRateCondition from "src/@shared/models/discount-rate-condition";
import { PaginationResponse } from "src/@shared/models/pagination";

export type DiscountRateListResponse = PaginationResponse<DiscountRateCondition>;