import { ByOffset } from '../../models';

export type ByOffsetCreateRequest = Omit<ByOffset, 'accountedId' | 'partnerNickName'>;
export type ByOffsetUpdateRequest = Omit<ByOffset, 'partnerId' | 'partnerNickName'>;
