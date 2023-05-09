import { Method } from "@/@shared/models/enum";
import { PaginationQuery } from "@/@shared/models/pagination";

/**
 * 수금 현금 요청
 */
interface CollectedByCash extends PaginationQuery {
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

export type CollectedByCashCreateRequest = CollectedByCash;
export type CollectedByCashUpdateRequest = CollectedByCash;