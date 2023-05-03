import { usePage } from "@/common/hook";
import { GetPaginationQuery, useQueryPagination } from "@/common/api/common";
import { Record } from "@/common/protocol";

export interface GetStockListQuery extends GetPaginationQuery {
  companyId?: number;
}
export function useGetStockList(
  query: GetStockListQuery,
  ignore: boolean = false
) {
  const [page, setPage] = usePage();
  const data = useQueryPagination<Record.VendorStock>(
    "external/stored-stock",
    ["stored-stock", `${query.companyId}`],
    {
      ...page,
      ...query,
    },
    ignore
  );

  return [data, page, setPage] as const;
}
