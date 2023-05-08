import { Method } from "@/@shared/models/enum";
import { PaginationResponse } from "@/@shared/models/pagination";

/**
 * 수금 응답
 */
interface Collected {
    /**
     * 파트너 식별자
     */
    partnerId: number;
    /**
     * 파트너 닉네임
     */
    partnerNickName: string;
    /**
     * 수금 식별자
     */
    collectedId: number;
    /**
     * 회계 등록일
     */
    collectedDate: string;
    /**
     * 회계 수단
     */
    collectedMethod: Method;
    /**
     * 계정 과목
     */
    collectedSubject: string;
    /**
     * 금액
     */
    amount: number;
    /**
     * 메모
     */
    memo: string;
    /**
     * 구분
     */
    gubun: string;
    /**
     * 등록자
     */
    regNm: string;
    /**
     * 등록일
     */
    regDt: Date;
    /**
     * 수정자
     */
    chgNm: string;
    /**
     * 수정일
     */
    chgDt: Date;
}

export type CollectedListResponse = PaginationResponse<Collected>;
export type CollectedItemResponse = Collected;