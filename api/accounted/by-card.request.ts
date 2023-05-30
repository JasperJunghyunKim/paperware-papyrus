import { ByCard } from '../../models';

export type ByCardCreateRequest = Omit<ByCard, 'accountedId' | 'partnerNickName' | 'cardName' | 'cardNumber' | 'cardCompany'>;
export type ByCardUpdateRequest = Omit<ByCard, 'companyId' | 'accountedId' | 'companyRegistrationNumber' | 'partnerNickName' | 'accountedId' | 'cardId' | 'cardName' | 'cardNumber' | 'cardCompany'>;
