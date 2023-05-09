import { Accounted } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type CollectedListResponse = PaginationResponse<Accounted>;
export type CollectedItemResponse = Accounted;
