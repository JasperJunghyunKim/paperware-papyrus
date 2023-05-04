import { Company } from "../../models";
import { PaginationResponse } from "../../models/pagination";

export interface VirtualCompanyListResponse
  extends PaginationResponse<Company> {}
export interface VirtualCompanyItemResponse extends Company {}
