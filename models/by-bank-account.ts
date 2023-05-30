import { AccountedType, Bank, Method, Subject } from "./enum";

export default interface ByBankAccount {
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
   * 은행계좌 식별자
   */
  bankAccountId: number;
  /**
   * 계좌 이름
   */
  accountName: string;
  /**
   * 계번 번호
   */
  accountNumber: string;
  /**
   * 은행
   */
  bankComapny: Bank;
}
