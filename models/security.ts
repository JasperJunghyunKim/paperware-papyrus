import { Bank, DrawedStatus, SecurityStatus, SecurityType } from "./enum";

/**
 * 유가증권
 */
export default interface Security {
  /**
   * 유가증권 식별자
   */
  securityId: number;
  /**
   * 유가증권 타입
   */
  securityType: SecurityType;
  /**
   * 유가증권 번호
   */
  securitySerial: string;
  /**
   * 유가증권 금액
   */
  securityAmount: number;
  /**
   * 유가증권 상태
   */
  securityStatus: SecurityStatus;
  /**
   * 발행 상태
   */
  drawedStatus: DrawedStatus;
  /**
   * 발행일
   */
  drawedDate: string;
  /**
   * 발행 은행
   */
  drawedBank: Bank;
  /**
   * 발행 은행 지점
   */
  drawedBankBranch: string;
  /**
   * 발행 지역
   */
  drawedRegion: string;
  /**
   * 발행인
   */
  drawer: string;
  /**
   * 만기일
   */
  maturedDate: string;
  /**
   * 지급은행
   */
  payingBank: Bank;
  /**
   * 지급은행 지점
   */
  payingBankBranch: string;
  /**
   * 지급인
   */
  payer: string;
  /**
   * 메모
   */
  memo: string;
}
