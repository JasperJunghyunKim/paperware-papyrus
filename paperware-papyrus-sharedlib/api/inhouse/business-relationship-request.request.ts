import { PaginationQuery } from '../../models/pagination';

export type BusinessRelationshipRequestListQuery = PaginationQuery;

export interface BusinessRelationshipRequestAcceptRequest {
  companyId: number;
}

export interface BusinessRelationshipRequestRejectRequest {
  companyId: number;
}
