import { PaginationQuery } from '../../models/pagination';

export interface BusinessRelationshipRequestListQuery extends PaginationQuery {}

export interface BusinessRelationshipRequestCreateRequest {
  companyId: number;
}

export interface BusinessRelationshipRequestAcceptRequest {
  companyId: number;
}

export interface BusinessRelationshipRequestRejectRequest {
  companyId: number;
}
