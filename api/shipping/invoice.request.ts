import { PaginationQuery } from '../../models/pagination';

export interface InvoiceListQuery extends PaginationQuery {
  shippingId: number | null;
}

export interface InvoiceDisconnectShippingRequest {
  invoiceIds: number[];
}

/** 송장 배송상태 진행 & 역행 */
export interface UpdateInvoiceStatusRequest {
  invoiceIds: number[];
}