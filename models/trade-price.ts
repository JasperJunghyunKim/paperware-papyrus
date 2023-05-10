import OrderStockTradePrice from "./order-stock-trade-price";

export default interface TradePrice {
    orderId: number;
    companyId: number;
    suppliedPrice: number;
    vatPrice: number;
    isBookClosed: boolean;
    orderStockTradePrice: OrderStockTradePrice | null;
}