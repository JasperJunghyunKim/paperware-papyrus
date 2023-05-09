import { Method } from '../../models/enum';
import { PaginationResponse } from '../../models/pagination';

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
   * 메모
   */
  memo: string;
  /**
   * 금액
   */
  amount: number;
}

export type CollectedByCashListResponse = PaginationResponse<CollectedByCash>;
export type CollectedByCashItemResponse = CollectedByCash;
