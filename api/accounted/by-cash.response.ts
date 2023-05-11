import { ByCash } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type ByCashQuery = ByCash;
export type ByCashListResponse = PaginationResponse<ByCash>;
export type ByCashItemResponse = ByCash;
