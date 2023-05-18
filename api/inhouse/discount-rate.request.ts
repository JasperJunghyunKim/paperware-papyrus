import DiscountRate from "../../models/discount-rate";
import { PackagingType } from "src/@shared/models/enum";

/** 고시가 등록 */
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