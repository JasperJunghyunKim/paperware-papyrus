import { PaginationQuery } from '../../models/pagination';

export interface BusinessRelationshipListQuery extends PaginationQuery {
  srcCompanyId: number;
  dstCompanyId: number;
}

export interface BusinessRelationshipCreateRequest {
  srcCompanyId: number;
  dstCompanyId: number;
}

export interface BusinessRelationshipCompactListQuery extends PaginationQuery {}

export interface SearchPartnerRequest {
  companyRegistrationNumber: string;
}

export interface RegisterPartnerRequest {
  companyRegistrationNumber: string;
  create: boolean;
  type: 'PURCHASE' | 'SALES' | 'BOTH';
  partnerNickname: string;
  invoiceCode: string;
  address: string;
  phoneNumber: string;
  faxNumber: string;
  email: string;
  memo: string;
}
