import { Method } from "@/@shared/models/enum";
import { PaginationQuery } from "@/@shared/models/pagination";

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
    collectedFromDate: string;
    /**
     * to date
     */
    collectedToDate: string;
    /**
     * 계정 과목
     */
    collectedSubject: string;
    /**
     * 회계 수단
     */
    collectedMethod: Method;
}

export type CollectedQuery = Collected;