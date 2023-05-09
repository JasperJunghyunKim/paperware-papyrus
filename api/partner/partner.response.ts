import { Partner } from "@/@shared/models";
import { PaginationQuery } from "@/@shared/models/pagination";

export type PartnerResponse = Omit<Partner, 'id'> & PaginationQuery & { partnerId: number };