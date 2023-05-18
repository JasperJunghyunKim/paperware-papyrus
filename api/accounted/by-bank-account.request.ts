import { ByBankAccount } from '../../models';

export type ByBankAccountCreateRequest = Omit<ByBankAccount, 'partnerNickName' | 'accountedId'>;
export type ByBankAccountUpdateRequest = Omit<ByBankAccount, 'partnerId' | 'partnerNickName'>;
