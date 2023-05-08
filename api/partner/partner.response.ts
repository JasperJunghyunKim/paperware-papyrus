import { Method } from "@/@shared/models/enum";
import { PaginationQuery } from "@/@shared/models/pagination";

/**
 * 파트너 응답
 */
interface Partner extends PaginationQuery {
    /**
     * 파트너 식별자
     */
    partnerId: number;
    /**
     * 파트너 이름
     */
    partnerName: string;
    /**
     * 파트너 닉네임
     */
    partnerNickName: string;
}

export type PartnerResponse = Partner;