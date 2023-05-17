import { ByCard } from '../../models';

export type ByCardCreateRequest = ByCard;
export type ByCardUpdateRequest = Omit<ByCard, 'partnerId' | 'partnerNickName'>;
