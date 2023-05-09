import { Method } from '../../models/enum';
import { PaginationQuery } from '../../models/pagination';

/**
 * 수금 기타 요청
 */
interface CollectedByEtc extends PaginationQuery {
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
   * 메모
   */
  memo: string;
  /**
   * 금액
   */
  amount: number;
}

export type CollectedByEtcCreateRequest = CollectedByEtc;
export type CollectedByEtcUpdateRequest = CollectedByEtc;
