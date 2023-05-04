import { Company } from '.';

export default interface Warehouse {
  id: number;
  name: string;
  code: string;
  isPublic: boolean;
  company: Company;
}
