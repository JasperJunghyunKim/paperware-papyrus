import { ByBankAccount } from '../../models';

export type ByBankAccountCreateRequest = Omit<ByBankAccount, 'partnerNickName' | 'accountedId' | 'accountName' | 'accountNumber' | 'bankComapny'>;
export type ByBankAccountUpdateRequest = Omit<ByBankAccount, 'companyId' | 'companyRegistrationNumber' | 'partnerNickName' | 'accountedId' | 'bankAccountId' | 'accountName' | 'accountNumber' | 'bankComapny'>;
