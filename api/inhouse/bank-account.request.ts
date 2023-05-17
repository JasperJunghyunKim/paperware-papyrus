import BankAccount from '../../models/bank-account';
import { PaginationQuery } from '../../models/pagination';

export type BankAccountQuery = PaginationQuery;
export type BankAccountCreateRequest = Omit<BankAccount, 'accountId'>;
export type BankAccountUpdateRequest = Pick<BankAccount, 'accountName'>;
