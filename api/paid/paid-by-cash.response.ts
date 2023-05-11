import { ByCash } from '@/@shared/models';
import { PaginationResponse } from '../../models/pagination';

export type PaidByCashQuery = ByCash;
export type PaidByCashListResponse = PaginationResponse<ByCash>;
export type PaidByCashItemResponse = ByCash;
