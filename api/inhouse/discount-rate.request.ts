import DiscountRate from "../../models/discount-rate";
import { PackagingType } from "src/@shared/models/enum";
import { PaginationQuery } from "src/@shared/models/pagination";

/** 할인율 거래처 목록 */
export type DiscountRatePartnerListQuery = PaginationQuery;

/** 할인율 등록 */
export interface DiscountRateCreateRequest {
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
    companyRegistrationNumber: string;
}

/** 할인율 수정 */
export interface DiscountRateUpdateRequest {
    basicDiscountRate: DiscountRate;
    specialDiscountRate: DiscountRate;
}