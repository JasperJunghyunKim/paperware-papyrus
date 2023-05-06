import { PaginationQuery } from 'src/@shared/models/pagination';

export type PlanListQuery = PaginationQuery;

export interface CreatePlanRequest {
  memo: string;
}

export interface UpdatePlanRequest {
  memo: string;
}
