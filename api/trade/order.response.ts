import { PaginationResponse } from 'src/@shared/models/pagination';
import { Order } from '../../models';

export type ORderListResponse = PaginationResponse<Order>;
export type OrderItemResponse = Order;
