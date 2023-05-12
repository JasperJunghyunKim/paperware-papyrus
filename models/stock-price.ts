import { DiscountType, OfficialPriceType, PriceUnit } from "./enum";

export default interface StockPrice {
    id: number;
    officialPriceType: OfficialPriceType;
    officialPrice: number;
    officialPriceUnit: PriceUnit;
    discountType: DiscountType;
    discountPrice: number;
    unitPrice: number;
    unitPriceUnit: PriceUnit;
}