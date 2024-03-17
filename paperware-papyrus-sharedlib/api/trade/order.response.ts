import { PaginationResponse } from '../../models/pagination';
import { ArrivalStockGroup, Order, StockGroup, TradePrice } from '../../models';

export type OrderListResponse = PaginationResponse<Order>;
export type OrderItemResponse = Order;

export type OrderStockArrivalListResponse = PaginationResponse<ArrivalStockGroup>;

export type OrderCreateResponse = Order;

/** 거래금액 조회 */
export type TradePriceResponse = TradePrice;