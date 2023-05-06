import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { PlanCreateRequest, PlanListQuery } from 'src/@shared/api';

export class PlanListQueryDto implements PlanListQuery {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly skip: number = 0;
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly take: number = undefined;
}

export class CreatePlanRequestDto implements PlanCreateRequest {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly productId: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly packagingId: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly grammage: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly sizeX: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly sizeY: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly paperColorGroupId: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly paperColorId: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly paperPatternId: number;
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly paperCertId: number;
  @IsOptional()
  @Type(() => String)
  readonly memo: string = '';
}
