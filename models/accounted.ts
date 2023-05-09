import { Entity, Partner } from ".";

export default interface Accounted extends Entity {
  id: number;
  accountedType: string;
  accountedMethod: string;
  accountedDate: Date;
  accountedSubject: string;
  memo: string;
  isDeleted: boolean;
  partnerId: number;
  partner: Partner;
}