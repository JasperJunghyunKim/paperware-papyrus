import { Method } from "@/@shared/models/enum";
import { PaginationResponse } from "@/@shared/models/pagination";

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


export type PaidByEtcListResponse = PaginationResponse<PaidByEtc>;
export type PaidByEtcItemResponse = PaidByEtc;