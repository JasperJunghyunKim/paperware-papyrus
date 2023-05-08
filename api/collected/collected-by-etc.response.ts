import { Method } from "@/@shared/models/enum";
import { PaginationResponse } from "@/@shared/models/pagination";

/**
 * 수금 기타 요청
 */
interface CollectedByEtc {
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


export type CollectedByEtcListResponse = PaginationResponse<CollectedByEtc>;
export type CollectedByEtcItemResponse = CollectedByEtc;