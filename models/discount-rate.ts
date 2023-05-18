import { PriceUnit } from "./enum";

export default interface DiscountRate {
    discountRate: number;
    discountRateUnit: PriceUnit;
}