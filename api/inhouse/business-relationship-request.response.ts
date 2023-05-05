import { BusinessRelationshipRequest } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type BusinessRelationshipRequestListResponse =
  PaginationResponse<BusinessRelationshipRequest>;

export type BusinessRelationshipRequestItemResponse =
  BusinessRelationshipRequest;

export interface BusinessRelationshipRequestPendingCountResponse {
  value: number;
}
