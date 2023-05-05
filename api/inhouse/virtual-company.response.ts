import { Company } from '../../models';
import { PaginationResponse } from '../../models/pagination';

export type VirtualCompanyListResponse = PaginationResponse<Company>;
export type VirtualCompanyItemResponse = Company;
