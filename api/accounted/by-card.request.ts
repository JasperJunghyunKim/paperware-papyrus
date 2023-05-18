import { ByCard } from '../../models';

export type ByCardCreateRequest = Omit<ByCard, 'accountedId'>;
export type ByCardUpdateRequest = Omit<ByCard, 'partnerId' | 'partnerNickName'>;
