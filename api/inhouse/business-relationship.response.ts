import {
  BusinessRelationship,
  BusinessRelationshipCompact,
  CompanyPartner,
} from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type BusinessRelationshipListResponse =
  PaginationResponse<BusinessRelationship>;

export type BusinessRelationshipItemResponse = BusinessRelationship;

export type BusinessRelationshipCompactListResponse =
  PaginationResponse<BusinessRelationshipCompact>;

export type SearchPartnerResponse = CompanyPartner;
