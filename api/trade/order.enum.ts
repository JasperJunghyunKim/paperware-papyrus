
export const OfficialPriceTypes = ["NONE", "MANUAL_NONE", "MANUAL_DEFAULT", "RETAIL", "WHOLESALE"] as const;
export const PriceUnits = ["WON_PER_TON", "WON_PER_REAM", "WON_PER_BOX"] as const;
export const DiscountTypes = ["DEFAULT", "SPECIAL"] as const;

export type OfficialPriceType = typeof OfficialPriceTypes[number];
export type PriceUnit = typeof PriceUnits[number];
export type DiscountType = typeof DiscountTypes[number];