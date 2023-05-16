import { PaginationQuery } from '../../models/pagination';

export type BusinessRelationshipRequestListQuery = PaginationQuery;

export interface BusinessRelationshipRequestCreateRequest {
  companyId: number;
  isPurchase: boolean;
  isSales: boolean;
}

export interface BusinessRelationshipRequestAcceptRequest {
  companyId: number;
}

export interface BusinessRelationshipRequestRejectRequest {
  companyId: number;
}
