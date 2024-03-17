import { Accounted } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type AccountedListResponse = PaginationResponse<Accounted>;
export type AccountedItemResponse = Accounted;
