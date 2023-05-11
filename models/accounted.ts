import { Entity } from ".";
import { AccountedType, Method, Subject } from "./enum";

export default interface Accounted extends Entity {
  /**
  * 파트너 식별자
  */
  partnerId: number;
  /**
   * 파트너 닉네임
   */
  partnerNickName: string;
  /**
   * 지급 식별자
   */
  accountedId: number;
  /**
   * 지급 타입
   */
  accountedType: AccountedType;
  /**
   * 회계 등록일
   */
  accountedDate: string;
  /**
   * 회계 수단
   */
  accountedMethod: Method;
  /**
   * 계정 과목
   */
  accountedSubject: Subject;
  /**
   * 금액
   */
  amount: number;
  /**
   * 메모
   */
  memo: string;
  /**
   * 구분
   */
  gubun: string;
}
