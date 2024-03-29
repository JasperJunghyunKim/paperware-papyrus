import { AccountedType, Method, SecurityStatus, Subject } from "./enum";

export default interface Accounted {
  /**
   * 사업자 식별자
   */
  companyId: number;
  /**
   * 사업자 번호
   */
  companyRegistrationNumber: string;
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
  /**
   * 유가증권 상태(optional)
   */
  securityStatus?: SecurityStatus;
}
