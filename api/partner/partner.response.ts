import { Partner } from '../../models';
import { PaginationQuery } from '../../models/pagination';

export type PartnerResponse = Omit<Partner, 'id'> &
  PaginationQuery & { partnerId: number };
