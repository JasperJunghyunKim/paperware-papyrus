import { Location } from "../../models";
import { PaginationResponse } from "../../models/pagination";

export interface LocationListResponse extends PaginationResponse<Location> {}
export interface LocationItemResponse extends Location {}
