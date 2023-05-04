import { usePage } from "@/common/hook";
import { Record } from "@/common/protocol";
import { useQueryPagination } from "../common";
import {
  GetPaginationQuery,
  useCreate,
  useDelete,
  useQueryData,
  useQueryItem,
  useUpdate,
} from "../common/prelude";
import { useQuery } from "react-query";
import axios from "axios";
import { Api } from "@shared";

export function useGetItem(id: number) {
  return useQuery(["inhouse", "warehouse"], async () => {
    const resp = await axios.get<Api.LocationItemResponse>(
      `/inhouse/warehouse/${id}`
    );
    return resp.data;
  });
}

export function useGetList(query: Partial<Api.LocationListQuery>) {
  return useQuery<Record.Warehouse>(["inhouse", "warehouse"], async () => {
    const resp = await axios.get("/inhouse/warehouse", {
      params: query,
    });
    return resp.data;
  });
}

export function useGetStat() {
  return useQueryData<Record.WarehouseStats>("internal/warehouse/stats", [
    "warehouse",
    "stats",
  ]);
}

export interface CreateWarehouse {
  name: string;
  code: string | null;
  isPublic: boolean;
  address: string;
}
export function useCreateWarehouse() {
  return useCreate<CreateWarehouse>("internal/warehouse", [["warehouse"]]);
}

export interface UpdateWarehouse {
  name: string;
  code: string | null;
  isPublic: boolean;
  address: string;
}
export function useUpdateWarehouse() {
  return useUpdate<UpdateWarehouse>("internal/warehouse", [["warehouse"]]);
}

export function useDeleteWarehouse() {
  return useDelete("internal/warehouse", [["warehouse"]]);
}
