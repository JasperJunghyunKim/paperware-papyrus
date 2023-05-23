import { PaginationResponse } from '../../models/pagination';
import { Security } from '../../models';

export type SecurityListResponse = PaginationResponse<Security>;
export type SecurityItemResponse = Security;
