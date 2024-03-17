import { Model } from '../..';
import { PaginationResponse } from '../../models/pagination';

export type InvoiceListResponse = PaginationResponse<Model.Invoice>;
