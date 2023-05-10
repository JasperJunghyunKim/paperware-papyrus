import { Company } from '.';

export default interface Shipping {
  id: number;
  shippingNo: string;
  company: Company;
}
