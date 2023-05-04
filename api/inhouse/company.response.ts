import { Company } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export interface CompanyListResponse extends PaginationResponse<Company> {}
export interface CompanyItemResponse extends Company {}
