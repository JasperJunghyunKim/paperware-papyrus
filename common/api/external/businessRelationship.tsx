import { usePage } from "@/common/hook";
import { GetPaginationQuery, useCreate, useQueryPagination } from "../common";
import { Record } from "@/common/protocol";
import { useQueryData } from "../common/prelude";

export interface GetBusinessRelationshipRequestListQuery
  extends GetPaginationQuery {}
export function useGetBusinessRelationshipRequestList(
  query: GetBusinessRelationshipRequestListQuery
) {
  const [page, setPage] = usePage();
  const data = useQueryPagination<Record.BusinessRelationshipRequest>(
    "external/business-relationship/request",
    ["business-relationship/request"],
    {
      ...page,
      ...query,
    }
  );

  return [data, page, setPage] as const;
}

export function useGetBusinessRelationshipRequestStats() {
  return useQueryData<Record.BusinessRelationshipRequestStats>(
    "external/business-relationship/request/stats",
    ["business-relationship/request"]
  );
}

export interface SendBusinessRelationshipRequest {
  dstCompanyId: number;
}

export function useSendBusinessRelationshipRequest() {
  return useCreate<SendBusinessRelationshipRequest>(
    "external/business-relationship/request/send",
    [["business-relationship/request"]],
    {
      message: (_data, _variables) => `매입처 등록 요청을 보냈습니다.`,
    }
  );
}

export interface AcceptBusinessRelationshipRequest {
  srcCompanyId: number;
}

export function useAcceptBusinessRelationshipRequest() {
  return useCreate<AcceptBusinessRelationshipRequest>(
    "external/business-relationship/request/accept",
    [["business-relationship/request"], ["business-relationship"]],
    {
      message: (_data, _variables) => `매입처 등록 요청을 승인했습니다.`,
    }
  );
}

export interface RejectBusinessRelationshipRequest {
  srcCompanyId: number;
}

export function useRejectBusinessRelationshipRequest() {
  return useCreate<RejectBusinessRelationshipRequest>(
    "external/business-relationship/request/reject",
    [["business-relationship/request"]],
    {
      message: (_data, _variables) => `매입처 등록 요청을 거절했습니다.`,
    }
  );
}
