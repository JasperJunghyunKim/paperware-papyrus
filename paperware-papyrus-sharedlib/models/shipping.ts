import { Company } from '.';
import { ShippingStatus } from './enum';

export default interface Shipping {
  id: number;
  shippingNo: string;
  status: ShippingStatus;
  company: Company;
}
