import { Company } from ".";

export default interface Partner {
    id: number;
    ceoName: string;
    ceoPhoneNumber: string;
    companyRegistrationNumber: string;
    representativeNumber: string;
    partnerNickName: string;
    partnerName: string;
    memo: string;
    isDeleted: boolean;
    companyId: number;
    company: Company;
    regId?: string;
    regNm?: string;
    chgId?: string;
    chgNm?: string;
    chgDt: Date;
    regDt: Date;
}