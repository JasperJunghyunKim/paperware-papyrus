import { ByOffset } from '../../models';

export type ByOffsetCreateRequest = Omit<ByOffset, 'accountedId' | 'partnerNickName'>;
export type ByOffsetUpdateRequest = Omit<ByOffset, 'companyId' | 'accountedId' | 'companyRegistrationNumber' | 'partnerNickName'>;
