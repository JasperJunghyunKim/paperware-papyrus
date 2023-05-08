
/** 정상 매출 등록 */
export interface StockGroup {
    warehouseId: number;
    productId: number;
    packageingId: number;
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