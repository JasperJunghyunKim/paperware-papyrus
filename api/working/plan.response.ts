import { Plan, StockEvent } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type PlanListResponse = PaginationResponse<Plan>;
export type PlanItemResponse = Plan;
export type PlanInputListResponse = PaginationResponse<StockEvent>;
