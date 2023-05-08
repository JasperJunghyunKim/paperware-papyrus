import { Accounted } from ".";

export default interface ByEtc {
    id: number;
    etcAmount: number;
    isDeleted: boolean;
    accountedId: number;
    accounted: Accounted;
    regId?: string;
    regNm?: string;
    chgId?: string;
    chgNm?: string;
    chgDt: Date;
    regDt: Date;
}