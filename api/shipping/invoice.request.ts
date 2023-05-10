import { PaginationQuery } from '../../models/pagination';

export interface InvoiceListQuery extends PaginationQuery {}

export interface InvoiceDisconnectShippingRequest {
  invoiceIds: number[];
}
