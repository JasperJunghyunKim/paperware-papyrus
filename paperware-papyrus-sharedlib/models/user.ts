import Company from './company';

export default interface User {
  id: number;
  company: Company;
  username: string;
  name: string;
  email: string | null;
}
