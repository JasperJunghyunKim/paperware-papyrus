import { PaginationQuery } from "../../models/pagination";

export interface LocationListQuery extends PaginationQuery {}

export interface LocationCreateRequest {
  name: string;
  code: string;
  isPublic: boolean;
  address: string;
}

export interface LocationUpdateRequest extends LocationCreateRequest {}
