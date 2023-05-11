import { PaginationQuery } from '../../models/pagination';

export interface InvoiceListQuery extends PaginationQuery {
  shippingId: number | null;
}

export interface InvoiceDisconnectShippingRequest {
  invoiceIds: number[];
}
