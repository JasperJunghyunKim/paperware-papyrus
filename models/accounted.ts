import { Partner } from ".";

export default interface Accounted {
  id: number;
  accountedType: string;
  accountedMethod: string;
  accountedDate: Date;
  accountedSubject: string;
  memo: string;
  isDeleted: boolean;
  partnerId: number;
  partner: Partner;
  regId?: string;
  regNm?: string;
  chgId?: string;
  chgNm?: string;
  chgDt: Date;
  regDt: Date;
}