import { ByEtc } from '../../models';

export type ByEtcCreateRequest = ByEtc;
export type ByEtcUpdateRequest = Omit<ByEtc, 'partnerId' | 'partnerNickName'>;
