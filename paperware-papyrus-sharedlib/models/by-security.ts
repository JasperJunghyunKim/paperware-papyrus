import { AccountedType, EndorsementType, Method, Subject } from "./enum";
import Security from "./security";

export default interface BySecurity {
  /**
   * 기업 식별자
   */
  companyId: number;
  /**
   * 사업자번호
   */
  companyRegistrationNumber: string;
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
   * 배서 타입
   */
  endorsementType: EndorsementType;
  /**
   * 배서자 이름
   */
  endorsement: string;
  /**
   * 유가증권
   */
  security: Security;
}
