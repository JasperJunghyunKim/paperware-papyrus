import { PaginationQuery } from 'src/@shared/models/pagination';

export type PlanListQuery = PaginationQuery;

export interface CreatePlanRequest {
  productId: number;
  packagingId: number;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroupId: number;
  paperColorId: number;
  paperPatternId: number;
  paperCertId: number;
  memo: string;
}
