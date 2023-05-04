import { StockGroup } from "../../models";
import { PaginationResponse } from "../../models/pagination";

export interface StockGroupListResponse extends PaginationResponse<StockGroup> { }
