import DiscountRate from "../../models/discount-rate";
import { DiscountRateType, PackagingType } from "../../models/enum";
import { PaginationQuery } from "../../models/pagination";

/** 할인율 거래처 목록 */
export type DiscountRatePartnerListQuery = PaginationQuery;

/** 할인율 등록 */
export interface DiscountRateCreateRequest {
    discountRateType: DiscountRateType;
    companyRegistrationNumber: string;
    packagingType?: PackagingType;
    paperDomainId?: number;
    manufacturerId?: number;
    paperGroupId?: number;
    paperTypeId?: number;
    grammage?: number;
    sizeX?: number;
    sizeY?: number;
    paperColorGroupId?: number;
    paperColorId?: number;
    paperPatternId?: number;
    paperCertId?: number;
    basicDiscountRate: DiscountRate;
    specialDiscountRate: DiscountRate;
}

/** 할인율 조회 */
export interface DiscountRateListQuery extends PaginationQuery {
    companyRegistrationNumber?: string;
    discountRateType: DiscountRateType;
}

/** 할인율 상세 */
export interface DiscountRateDetailQuery {
    discountRateType: DiscountRateType;
}

/** 할인율 수정 */
export interface DiscountRateUpdateRequest {
    discountRateType: DiscountRateType;
    basicDiscountRate: DiscountRate;
    specialDiscountRate: DiscountRate;
}

/** 할인율 삭제 */
export interface DiscountRateDeleteQuery {
    discountRateType: DiscountRateType;
}

/** 할인율 매핑 */
export interface DiscountRateMappingQuery {
    companyRegistrationNumber: string;
    discountRateType: DiscountRateType;
    packagingType?: PackagingType;
    paperDomainId?: number;
    manufacturerId?: number;
    paperGroupId?: number;
    paperTypeId?: number;
    grammage?: number;
    sizeX?: number;
    sizeY?: number;
    paperColorGroupId?: number;
    paperColorId?: number;
    paperPatternId?: number;
    paperCertId?: number;
}