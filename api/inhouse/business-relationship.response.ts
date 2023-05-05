import { BusinessRelationship } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type BusinessRelationshipListResponse =
  PaginationResponse<BusinessRelationship>;

export type BusinessRelationshipItemResponse = BusinessRelationship;
