import { PaginationQuery } from '../../models/pagination';

export interface BusinessRelationshipListQuery extends PaginationQuery {
  srcCompanyId: number;
  dstCompanyId: number;
}

export interface BusinessRelationshipCreateRequest {
  dstCompanyId: number;
}
