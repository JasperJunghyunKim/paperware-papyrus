import { Method } from "@/@shared/models/enum";
import { PaginationQuery } from "@/@shared/models/pagination";

/**
 * 지급 현금 요청
 */
interface PaidByCash extends PaginationQuery {
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

export type PaidByCashCreateRequest = PaidByCash;
export type PaidByCashUpdateRequest = PaidByCash;