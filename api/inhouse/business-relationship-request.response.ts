import { BusinessRelationshipRequest } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export interface BusinessRelationshipRequestListResponse
  extends PaginationResponse<BusinessRelationshipRequest> {}

export interface BusinessRelationshipRequestItemResponse
  extends BusinessRelationshipRequest {}
