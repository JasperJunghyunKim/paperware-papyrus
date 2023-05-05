import { Company } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type CompanyListResponse = PaginationResponse<Company>;
export type CompanyItemResponse = Company;
