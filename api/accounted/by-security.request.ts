import BySecurity from '../../models/by-security';

export type BySecurityCreateRequest = Omit<BySecurity, 'accountedId' | 'partnerNickName'>;
export type BySecurityUpdateRequest = Omit<BySecurity, 'companyId' | 'accountedId' | 'companyRegistrationNumber' | 'partnerNickName'>;
