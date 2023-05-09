import { Company, Entity } from ".";

export default interface Partner extends Entity {
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
}