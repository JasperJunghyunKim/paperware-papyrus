import { Order } from "../../models";
import { PaginationResponse } from "../../models/pagination";

export type SalesListResponse = PaginationResponse<Order>;