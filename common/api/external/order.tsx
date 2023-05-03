import { usePage } from "@/common/hook";
import { GetPaginationQuery, useCreate, useQueryPagination } from "../common";
import { Record } from "@/common/protocol";
import {
  useDelete,
  useQueryData,
  useQueryItem,
  useUpdate,
} from "../common/prelude";

export function useGetOrder(id: number | false) {
  return useQueryItem<Record.Order>("external/order", ["order"], id);
}

export interface GetOrderListQuery extends GetPaginationQuery {}
export function useGetOrderList(query: GetOrderListQuery) {
  const [page, setPage] = usePage();
  const data = useQueryPagination<Record.Order>("external/order", ["order"], {
    ...page,
    ...query,
  });

  return [data, page, setPage] as const;
}

export function useGetOrderStats() {
  return useQueryData<Record.OrderStats>("external/order/stats", ["order"]);
}

export interface GetReceivingOrderListQuery extends GetPaginationQuery {}
export function useGetReceivingOrderList(query: GetReceivingOrderListQuery) {
  const [page, setPage] = usePage();
  const data = useQueryPagination<Record.Order>(
    "external/receiving-order",
    ["order"],
    {
      ...page,
      ...query,
    }
  );

  return [data, page, setPage] as const;
}

export interface CreateOrder {
  dstCompanyId: number;
  memo: string;
  wantedDate: string | null;
}
export function useCreateOrder() {
  return useCreate<CreateOrder, Record.Order>("external/order", [["order"]]);
}

export interface CreateOrderSales {
  srcCompanyId: number;
  memo: string;
  wantedDate: string | null;
}
export function useCreateOrderSales() {
  return useCreate<CreateOrderSales, Record.Order>("external/order/sales", [
    ["order"],
  ]);
}

export interface UpdateOrder {
  memo: string;
  wantedDate: string | null;
}
export function useUpdateOrder() {
  return useUpdate<UpdateOrder>("external/order", [["order"]], {
    message(_data, _variables) {
      return `주문을 수정하였습니다.`;
    },
  });
}

export interface OrderUnique {
  id: number;
}

export function useOrderRequest(id: number | null) {
  return useCreate<OrderUnique>(`external/order/${id}/request`, [["order"]], {
    message(_data, _variables) {
      return `발주를 요청하였습니다.`;
    },
    ignore: !id,
  });
}

export function useOrderRecover(id: number | null) {
  return useCreate<OrderUnique>(`external/order/${id}/recover`, [["order"]], {
    message(_data, _variables) {
      return `거절된 주문을 수정 가능한 상태로 업데이트했습니다.`;
    },
    ignore: !id,
  });
}

export function useOrderCancel(id: number | null) {
  return useCreate<OrderUnique>(`external/order/${id}/cancel`, [["order"]], {
    message(_data, _variables) {
      return `주문을 취소하였습니다.`;
    },
    ignore: !id,
  });
}

export function useOrderAccept(id: number | null) {
  return useCreate<OrderUnique>(`external/order/${id}/accept`, [["order"]], {
    message(_data, _variables) {
      return `발주를 승인하였습니다.`;
    },
    ignore: !id,
  });
}

export function useOrderReject(id: number | null) {
  return useCreate<OrderUnique>(`external/order/${id}/reject`, [["order"]], {
    message(_data, _variables) {
      return `발주를 거절하였습니다.`;
    },
    ignore: !id,
  });
}
