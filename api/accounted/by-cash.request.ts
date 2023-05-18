import { ByCash } from '../../models';

export type ByCashCreateRequest = Omit<ByCash, 'accountedId' | 'partnerNickName'>;
export type ByCashUpdateRequest = Omit<ByCash, 'partnerId' | 'partnerNickName'>;
