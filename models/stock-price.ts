
enum OfficialPriceType {
    NONE = 'NONE',
    MANUAL_NONE = 'MANUAL_NONE',
    MANUAL_DEFAULT = 'MANUAL_DEFAULT',
    RETAIL = 'RETAIL',
    WHOLESALE = 'WHOLESALE',
}

enum DiscountType {
    DEFAULT = 'DEFAULT',
    SPECIAL = 'SPECIAL',
}

enum PriceUnit {
    WON_PER_TON = 'WON_PER_TON',
    WON_PER_REAM = 'WON_PER_REAM',
    WON_PER_BOX = 'WON_PER_BOX',
}

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