
export default interface OrderStockTradePrice {
    orderId: number;
    companyId: number;
    suppliedPrice: number;
    vatPrice: number;
    isBookClosed: boolean;
    orderStockTradePrice: OrderStockTradePrice | null;
}