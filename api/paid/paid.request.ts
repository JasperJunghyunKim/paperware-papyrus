import { Method } from "@/@shared/models/enum";
import { PaginationQuery } from "@/@shared/models/pagination";

/**
 * 지급 요청
 */
interface Paid extends PaginationQuery {
    /**
     * 파트너 식별자
     */
    partnerId: number;
    /**
     * from date
     */
    paidFromDate: string;
    /**
     * to date
     */
    paidToDate: string;
    /**
     * 계정 과목
     */
    paidSubject: string;
    /**
     * 회계 수단
     */
    paidMethod: Method;
}

export type PaidRequest = Paid;