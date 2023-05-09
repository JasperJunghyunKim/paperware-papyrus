import { Accounted } from "@/@shared/models";
import { PaginationResponse } from "@/@shared/models/pagination";

export type CollectedListResponse = PaginationResponse<Accounted>;
export type CollectedItemResponse = Accounted;