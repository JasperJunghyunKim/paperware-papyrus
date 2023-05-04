import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import {
  BusinessRelationshipCreateRequest,
  BusinessRelationshipListQuery,
} from 'src/@shared/api';

export class BusinessRelationshipListQueryDto
  implements BusinessRelationshipListQuery
{
  @IsInt()
  @Type(() => Number)
  skip: number = 0;
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  take: number = undefined;
  @IsOptional()
  @IsInt()
  srcCompanyId: number;
  @IsOptional()
  @IsInt()
  dstCompanyId: number;
}

export class BusinessRelationshipCreateRequestDto
  implements BusinessRelationshipCreateRequest
{
  @IsInt()
  srcCompanyId: number;
  @IsInt()
  dstCompanyId: number;
}
