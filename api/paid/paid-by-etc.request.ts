import { Method, Subject } from '../../models/enum';

/**
 * 지급 기타 요청
 */
interface PaidByEtc {
  /**
   * 파트너 식별자
   */
  partnerId: number;
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
}

export type PaidByEtcCreateRequest = PaidByEtc;
export type PaidByEtcUpdateRequest = PaidByEtc;
