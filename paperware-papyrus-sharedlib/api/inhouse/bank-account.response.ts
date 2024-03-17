import { PaginationResponse } from '../../models/pagination';
import BankAccount from '../..//models/bank-account';

export type BankAccountListResponse = PaginationResponse<BankAccount>;
export type BankAccountItemResponse = BankAccount;
