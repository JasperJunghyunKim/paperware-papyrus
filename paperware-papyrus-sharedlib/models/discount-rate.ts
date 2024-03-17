import { DiscountRateUnit } from "./enum";

export default interface DiscountRate {
    discountRate: number;
    discountRateUnit: DiscountRateUnit;
}