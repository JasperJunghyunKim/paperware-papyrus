import { Accounted } from "@/@shared/models";
import { PaginationResponse } from "@/@shared/models/pagination";

export type PaidListResponse = PaginationResponse<Accounted>;
export type PaidItemResponse = Accounted;