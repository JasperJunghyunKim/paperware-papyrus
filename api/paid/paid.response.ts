import { Method } from "@/@shared/models/enum";
import { PaginationResponse } from "@/@shared/models/pagination";

/**
 * 지급 응답
 */
interface Paid {
    /**
     * 파트너 식별자
     */
    partnerId: number;
    /**
     * 파트너 닉네임
     */
    partnerNickName: string;
    /**
     * 지급 식별자
     */
    paidId: number;
    /**
     * 회계 등록일
     */
    paidDate: string;
    /**
     * 회계 수단
     */
    paidMethod: Method;
    /**
     * 계정 과목
     */
    paidSubject: string;
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

export type PaidListResponse = PaginationResponse<Paid>;
export type PaidItemResponse = Paid;