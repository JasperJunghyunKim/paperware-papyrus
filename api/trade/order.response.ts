import { PaginationResponse } from '../../models/pagination';
import { Order, StockEvent } from '../../models';

export type OrderListResponse = PaginationResponse<Order>;
export type OrderItemResponse = Order;

export type OrderStockArrivalListResponse = PaginationResponse<StockEvent>;

export type OrderCreateResponse = Order;
