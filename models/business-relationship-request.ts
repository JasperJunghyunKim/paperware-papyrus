import Company from './company';
import { BusinessRelationshipRequestStatus } from './enum';

export default interface BusinessRelationshipRequest {
  srcCompany: Company;
  dstCompany: Company;
  status: BusinessRelationshipRequestStatus;
  memo: string;
}
