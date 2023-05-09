import { PaginationResponse } from '../../models/pagination';
import { Order } from '../../models';

export type OrderListResponse = PaginationResponse<Order>;
export type OrderItemResponse = Order;
