import { PaginationQuery } from '../../models/pagination';

export interface ShippingListQuery extends PaginationQuery {}

export interface ShippingCreateRequest {}

export interface ShippingConnectInvoicesRequest {
  invoiceIds: number[];
}
