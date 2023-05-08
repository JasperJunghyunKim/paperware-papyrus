import Accounted from "./accounted";

export default interface ByCash {
    id: number;
    cashAmount: number;
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