import { Method, Subject } from '../../models/enum';
import { PaginationQuery } from '../../models/pagination';

/**
 * 수금 요청
 */
interface Collected extends PaginationQuery {
  /**
   * 파트너 식별자
   */
  partnerId: number;
  /**
   * from date
   */
  accountedFromDate: string;
  /**
   * to date
   */
  accountedToDate: string;
  /**
   * 계정 과목
   */
  accountedSubject: Subject;
  /**
   * 회계 수단
   */
  collectedMethod: Method;
}

export type CollectedQuery = Collected;
