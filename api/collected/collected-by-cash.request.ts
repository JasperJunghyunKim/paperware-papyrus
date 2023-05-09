import { Method, Subject } from '../../models/enum';

/**
 * 수금 현금 요청
 */
interface CollectedByCash {
  /**
   * 파트너 식별자
   */
  partnerId: number;
  /**
   * 파트너 닉네임
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

export type CollectedByCashCreateRequest = CollectedByCash;
export type CollectedByCashUpdateRequest = CollectedByCash;
