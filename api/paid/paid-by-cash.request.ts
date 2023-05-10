import { Method, Subject } from '../../models/enum';

/**
 * 지급 현금 요청
 */
interface PaidByCash {
  /**
   * 파트너 식별자
   */
  partnerId: number;
  /**
   * 파트너 식별자
   */
  partnerNickName: string;
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

export type PaidByCashCreateRequest = PaidByCash;
export type PaidByCashUpdateRequest = PaidByCash;
