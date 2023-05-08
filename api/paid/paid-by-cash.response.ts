import { Method } from "@/@shared/models/enum";
import { PaginationResponse } from "@/@shared/models/pagination";

/**
 * 지급 현금 요청
 */
interface PaidByCash {
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
    paidDate: string;
    /**
     * 회계 수단
     */
    paidMethod: Method;
    /**
     * 메모
     */
    memo: string;
    /**
     * 금액
     */
    amount: number;
}


export type PaidByCashListResponse = PaginationResponse<PaidByCash>;
export type PaidByCashItemResponse = PaidByCash;