import { ByCash } from '@/@shared/models';
import { PaginationResponse } from '../../models/pagination';

export type CollectedByCashListResponse = PaginationResponse<ByCash>;
export type CollectedByCashItemResponse = ByCash;
