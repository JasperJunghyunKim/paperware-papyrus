import { OfficialPrice } from "../../models";
import { PaginationQuery } from "../../models/pagination";

/** 고시가 목록 */
export type OfficialPriceListQuery = PaginationQuery;

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
