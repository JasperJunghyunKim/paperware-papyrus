import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { StockCreateRequest } from 'src/@shared/api/stock/stock.request';


/** 재고생성 (신규등록) */
export class StockCreateRequestDto implements StockCreateRequest {
    @IsOptional()
    @IsInt()
    @IsPositive()
    warehouseId: number | null = null;

    @IsInt()
    @IsPositive()
    productId: number;

    @IsInt()
    @IsPositive()
    packagingId: number;

    @IsInt()
    @IsPositive()
    grammage: number;

    @IsInt()
    @IsPositive()
    sizeX: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    sizeY: number = 0;

    @IsOptional()
    @IsInt()
    @IsPositive()
    paperColorGroupId: number | null = null;

    @IsOptional()
    @IsInt()
    @IsPositive()
    paperColorId: number | null = null;

    @IsOptional()
    @IsInt()
    @IsPositive()
    paperPatternId: number | null = null;

    @IsOptional()
    @IsInt()
    @IsPositive()
    paperCertId: number | null = null;

    @IsNumber()
    @IsPositive()
    quantity: number;
}