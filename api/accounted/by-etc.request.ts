import { ByEtc } from '../../models';

export type ByEtcCreateRequest = Omit<ByEtc, 'accountedId' | 'partnerNickName'>;
export type ByEtcUpdateRequest = Omit<ByEtc, 'companyId' | 'accountedId' | 'companyRegistrationNumber' | 'partnerNickName'>;
