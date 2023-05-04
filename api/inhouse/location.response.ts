import { Location } from "../../models";
import { PaginationResponse } from "../../models/pagination";

export interface LocationListResponse extends PaginationResponse<Location> {}
