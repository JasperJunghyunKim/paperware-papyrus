import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';
import {
  WarehouseCreateRequest,
  WarehouseListQuery,
  WarehouseUpdateRequest,
} from 'src/@shared/api/inhouse/warehouse.request';

export class WarehouseListQueryDto implements WarehouseListQuery {
  @IsNumber()
  skip: string;
  @IsNumber()
  take: string;
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
