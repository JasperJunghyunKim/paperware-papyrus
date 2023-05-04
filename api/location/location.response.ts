import { Location } from 'src/@shared/models';
import { PaginationResponse } from 'src/@shared/models/pagination';

export interface LocationListResponse extends PaginationResponse<Location> {}
