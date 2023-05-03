import {
  GetPaginationQuery,
  useCreate,
  useDelete,
  useQueryItem,
  useQueryPagination,
  useUpdate,
} from "@/common/api/common";
import { usePage } from "@/common/hook";
import { Record } from "@/common/protocol";

export function useGetOrderStock(id: number | false) {
  return useQueryItem<Record.OrderStock>("external/order-stock", ["order"], id);
}

export interface GetOrderStockListQuery extends GetPaginationQuery {
  orderId?: number;
}
export function useGetOrderStockList(
  query: GetOrderStockListQuery,
  ignore = false
) {
  const [page, setPage] = usePage();
  const data = useQueryPagination<Record.OrderStock>(
    "external/order-stock",
    ["order-stock", `${query.orderId}`],
    {
      ...page,
      ...query,
    },
    ignore
  );

  return [data, page, setPage] as const;
}

export interface CreateOrderStock {
  orderId: number;
  productId: number;
  packagingId: number;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroupId: number | null;
  paperColorId: number | null;
  paperPatternId: number | null;
  paperCertId: number[];
  quantity: number;
  memo: string;
  dstLocationId: number | null;
}

export function useCreateOrderStock() {
  return useCreate<CreateOrderStock, Record.OrderStock>(
    "external/order-stock",
    [["order-stock"]]
  );
}

export interface UpdateOrderStock {
  productId: number;
  packagingId: number;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroupId: number | null;
  paperColorId: number | null;
  paperPatternId: number | null;
  paperCertId: number[];
  quantity: number;
  memo: string;
  dstLocationId: number;
}

export function useUpdateOrderStock() {
  return useUpdate<Record.OrderStock, UpdateOrderStock>(
    "external/order-stock",
    [["order-stock"]]
  );
}

export function useDeleteOrderStock() {
  return useDelete("external/order-stock", [["order"]]);
}
