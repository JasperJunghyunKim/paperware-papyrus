import { Accounted } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type PaidListResponse = PaginationResponse<Accounted>;
export type PaidItemResponse = Accounted;
