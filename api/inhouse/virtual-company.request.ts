import { PaginationQuery } from "../../models/pagination";

export interface VirtualCompanyListQuery extends PaginationQuery {}

export interface VirtualCompanyCreateRequest {
  businessName: string;
  phoneNo: string;
  faxNo: string;
  email: string;
}

export interface VirtualCompanyUpdateRequest
  extends VirtualCompanyCreateRequest {}
