import { PaginationQuery } from "../../models/pagination";

/** 매출 목록 조회 */
export type SalesListQuery = PaginationQuery;

/** 정상 매출 등록 */
export interface StockGroup {
    warehouseId: number;
    productId: number;
    packagingId: number;
    grammage: number;
    sizeX: number;
    sizeY?: number;
    paperColorGroupId?: number;
    paperColorId?: number;
    paperPatternId?: number;
    paperCertId?: number;
}

export interface CreateNormalSalesRequest {
    dstCompanyId: number;
    locationId: number;
    memo: string;
    wantedDate: string;
    stockGroup: StockGroup;
    quantity: number;
}