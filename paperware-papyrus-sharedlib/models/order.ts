import { OrderStock } from '.';
import Company from './company';
import { OrderStatus } from './enum';

export default interface Order {
  id: number;
  orderNo: string;
  srcCompany: Company;
  dstCompany: Company;
  status: OrderStatus;
  isEntrusted: boolean;
  memo: string;
  wantedDate: string;
  stockAcceptedCompanyId: number | null;
  isStockRejected: boolean;
  orderStock: OrderStock;
}
