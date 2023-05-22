import { ByCard } from '../../models';

export type ByCardCreateRequest = Omit<ByCard, 'accountedId' | 'partnerNickName'>;
export type ByCardUpdateRequest = Omit<ByCard, 'companyId' | 'accountedId' | 'companyRegistrationNumber' | 'partnerNickName' | 'accountedId'>;
