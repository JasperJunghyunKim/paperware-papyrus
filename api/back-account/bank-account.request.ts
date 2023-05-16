import BankAccount from 'src/@shared/models/bank-account';
import { PaginationQuery } from '../../models/pagination';

export type BankAccountQuery = PaginationQuery;
export type BankAccountCreateRequest = BankAccount;
export type BankAccountUpdateRequest = Pick<BankAccount, 'accountName'>;
