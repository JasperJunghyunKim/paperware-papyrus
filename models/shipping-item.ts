import { Company } from '.';
import { ShippingStatus } from './enum';

export default interface ShippingItem {
  id: number;
  shippingNo: string;
  status: ShippingStatus;
  company: Company;
  invoiceCount: number;
}
