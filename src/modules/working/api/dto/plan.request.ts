import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreatePlanRequest, PlanListQuery } from 'src/@shared/api';

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

export class CreatePlanRequestDto implements CreatePlanRequest {
  @IsString()
  @MaxLength(500)
  readonly memo: string;
}

export class UpdatePlanRequestDto implements CreatePlanRequest {
  @IsString()
  @MaxLength(500)
  readonly memo: string;
}
