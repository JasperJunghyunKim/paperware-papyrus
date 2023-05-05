import { Location } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type LocationListResponse = PaginationResponse<Location>;
export type LocationItemResponse = Location;
