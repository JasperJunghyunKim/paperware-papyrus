import { Method, Subject } from '../../models/enum';
import { PaginationResponse } from '../../models/pagination';

/**
 * 지급 기타 요청
 */
interface PaidByEtc {
  /**
   * 파트너 식별자
   */
  partnerId: number;
  /**
   * 파트너 닉네임
   */
  partnerNickName: string;
  /**
   * 회계 식별자
   */
  accountedId: number;
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

export type PaidByEtcQuery = PaidByEtc;
export type PaidByEtcListResponse = PaginationResponse<PaidByEtc>;
export type PaidByEtcItemResponse = PaidByEtc;
