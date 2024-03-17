import { PaginationQuery } from '../../models/pagination';

export type LocationListQuery = PaginationQuery;

export interface LocationCreateRequest {
  name: string;
  code: string;
  isPublic: boolean;
  address: string;
}

export type LocationUpdateRequest = LocationCreateRequest;

export interface LocationForSalesListQuery extends PaginationQuery {
  targetCompanyId: number;
}
