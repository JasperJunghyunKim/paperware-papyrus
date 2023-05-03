import { useState } from "react";
import { Api } from ".";

export function usePage() {
  const [page, setPage] = useState<Api.Common.GetPaginationQuery>({
    skip: 0,
    take: 100,
  });

  return [page, setPage] as const;
}
