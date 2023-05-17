import { ByCash } from '../../models';

export type ByCashCreateRequest = ByCash;
export type ByCashUpdateRequest = Omit<ByCash, 'partnerId' | 'partnerNickName'>;
