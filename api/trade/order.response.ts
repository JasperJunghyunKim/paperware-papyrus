import { PaginationResponse } from 'src/@shared/models/pagination';
import { Order } from '../../models';

export type OrderListResponse = PaginationResponse<Order>;
export type OrderItemResponse = Order;
