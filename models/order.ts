import Company from "./company";
import Stock from "./stock";

enum OrderStatus {
    ORDER_PREPARING = 'ORDER_PREPARING',
    ORDER_CANCELLED = 'ORDER_CANCELLED',
    ORDER_REQUESTED = 'ORDER_REQUESTED',
    ORDER_ACCEPTED = 'ORDER_ACCEPTED',
    ORDER_REJECTED = 'ORDER_REJECTED',
    STOCK_OFFER_PREPARING = 'STOCK_OFFER_PREPARING',
    STOCK_OFFER_REQUESTED = 'STOCK_OFFER_REQUESTED',
    STOCK_OFFER_ACCEPTED = 'STOCK_OFFER_ACCEPTED',
}

export default interface Order {
    id: number;
    orderNo: string;
    srcCompany: Company;
    dstCompany: Company;
    status: OrderStatus;
    memo: string;
    wantedDate: string;
    stockAcceptedCompanyId: number | null;
    isStockRejected: boolean | null;
    orderStock: Stock | null;
}