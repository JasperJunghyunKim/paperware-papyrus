import { ByEtc } from '../../models';

export type ByEtcCreateRequest = Omit<ByEtc, 'accountedId' | 'partnerNickName'>;
export type ByEtcUpdateRequest = Omit<ByEtc, 'accountedId' | 'partnerId' | 'partnerNickName'>;
