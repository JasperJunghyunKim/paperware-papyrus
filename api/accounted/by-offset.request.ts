import { ByOffset } from '../../models';

export type ByOffsetCreateRequest = ByOffset;
export type ByOffsetUpdateRequest = Omit<ByOffset, 'partnerId' | 'partnerNickName'>;
