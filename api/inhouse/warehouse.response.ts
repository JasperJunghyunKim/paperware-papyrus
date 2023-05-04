import { Warehouse } from "../../models";
import { PaginationResponse } from "../../models/pagination";

export interface WarehouseListResponse extends PaginationResponse<Warehouse> {}
