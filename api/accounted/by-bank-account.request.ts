import { ByBankAccount } from '../../models';

export type ByBankAccountCreateRequest = ByBankAccount;
export type ByBankAccountUpdateRequest = Omit<ByBankAccount, 'partnerId' | 'partnerNickName'>;
