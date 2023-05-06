import { Plan } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type PlanListResponse = PaginationResponse<Plan>;
export type PlanItemResponse = Plan;
