import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsString, MaxLength } from 'class-validator';
import {
  WarehouseCreateRequest,
  WarehouseListQuery,
  WarehouseUpdateRequest,
} from 'src/@shared/api/inhouse/warehouse.request';

export class WarehouseListQueryDto implements WarehouseListQuery {
  @IsInt()
  @Type(() => Number)
  skip: number;
  @IsInt()
  @Type(() => Number)
  take: number;
}

export class WarehouseCreateRequestDto implements WarehouseCreateRequest {
  @IsString()
  @MaxLength(50)
  name: string;
  @IsString()
  @MaxLength(4)
  code: string;
  @IsBoolean()
  isPublic: boolean;
  @IsString()
  address: string;
}

export class WarehouseUpdateRequestDto implements WarehouseUpdateRequest {
  @IsString()
  @MaxLength(50)
  name: string;
  @IsString()
  @MaxLength(4)
  code: string;
  @IsBoolean()
  isPublic: boolean;
  @IsString()
  address: string;
}
