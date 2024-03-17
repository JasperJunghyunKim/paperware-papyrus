import OrderStockTradeAltBundle from "./order-stock-trade-alt-bundle";

export default interface OrderStockTradePrice {
    orderId: number;
    companyId: number;
    officialPriceType: any;
    officialPrice: number;
    officialPriceUnit: any;
    discountType: any;
    discountPrice: number;
    unitPrice: number;
    unitPriceUnit: any;
    processPrice: number;
    orderStockTradeAltBundle: OrderStockTradeAltBundle | null;
}