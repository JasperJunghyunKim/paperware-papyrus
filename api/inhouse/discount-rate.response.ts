import DiscountRateCondition from "../../models/discount-rate-condition";
import { Manufacturer, PaperCert, PaperColor, PaperColorGroup, PaperDomain, PaperGroup, PaperPattern, PaperType, Partner } from "../../models";
import { PaginationResponse } from "../../models/pagination";
import { DiscountRateMapType, DiscountRateUnit, PackagingType, PriceUnit } from "../../models/enum";

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

/** 할인율 매핑 */
export type DiscountRateMappingResponse = {
    discountRateCondition: {
        packagingType: PackagingType | null;
        paperDomain: PaperDomain | null;
        manufacturer: Manufacturer | null;
        paperGroup: PaperGroup | null;
        paperType: PaperType | null;
        grammage: number | null;
        sizeX: number | null;
        sizeY: number | null;
        paperColorGroup: PaperColorGroup | null;
        paperColor: PaperColor | null;
        paperPattern: PaperPattern | null;
        paperCert: PaperCert | null;
    }
    discountRateMapType: DiscountRateMapType;
    discountRate: number;
    discountRateUnit: DiscountRateUnit;
}[];