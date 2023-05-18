import { AccountedType, Method, Subject } from "./enum";

export default interface ByCard {
  /**
   * 파트너 식별자
   */
  partnerId: number;
  /**
   * 파트너 닉네임
   */
  partnerNickName: string;
  /**
   * 식별자
   */
  accountedId: number;
  /**
   * 회계 유형
   */
  accountedType: AccountedType;
  /**
   * to date
   */
  accountedDate: string;
  /**
   * 회계 수단
   */
  accountedMethod: Method;
  /**
   * 회계 과목
   */
  accountedSubject: Subject;
  /**
   * 메모
   */
  memo: string;
  /**
   * 금액
   */
  amount: number;
  /**
   * 카드 식별자
   */
  cardId: number;
  /**
   * 카드 수수료
   */
  chargeAmount: number;
  /**
   * 수수료 총 금액 
   * @description 합 or 뺀 금액(지급, 수급에 따라 변경)
   */
  totalAmount: number;
  /**
   * 수수료 여부
   */
  isCharge: boolean;
  /**
   * 승인번호
   */
  approvalNumber: string;
}
