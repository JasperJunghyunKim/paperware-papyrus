import { Method } from "@/@shared/models/enum";
import { PaginationResponse } from "@/@shared/models/pagination";

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
    collectedDate: string;
    /**
     * 회계 수단
     */
    collectedMethod: Method;
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