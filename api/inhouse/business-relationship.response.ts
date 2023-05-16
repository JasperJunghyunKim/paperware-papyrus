import {
  BusinessRelationship,
  BusinessRelationshipCompact,
  Partner,
} from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type BusinessRelationshipListResponse =
  PaginationResponse<BusinessRelationship>;

export type BusinessRelationshipItemResponse = BusinessRelationship;

export type BusinessRelationshipCompactListResponse =
  PaginationResponse<BusinessRelationshipCompact>;

export type SearchPartnerResponse = Partner;
