import { OfficialPrice } from "src/@shared/models";

/** 고시가 등록 */
export interface OfficialPriceCreateRequest {
    productId: number;
    grammage: number;
    sizeX: number;
    sizeY: number;
    paperColorGroupId?: number;
    paperColorId?: number;
    paperPatternId?: number;
    paperCertId?: number;
    wholesalePrice: OfficialPrice;
    retailPrice: OfficialPrice;
}