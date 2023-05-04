import { BusinessRelationship } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export interface BusinessRelationshipListResponse
  extends PaginationResponse<BusinessRelationship> {}

export interface BusinessRelationshipItemResponse
  extends BusinessRelationship {}
