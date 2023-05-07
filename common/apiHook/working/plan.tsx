import { Api } from "@/@shared";
import { API_HOST } from "@/common/const";
import axios from "axios";
import { useMutation, useQuery } from "react-query";

export function useGetList(params: { query: Partial<Api.PlanListQuery> }) {
  return useQuery(
    ["plan", "list", params.query.skip, params.query.take],
    async () => {
      const resp = await axios.get<Api.PlanListResponse>(
        `${API_HOST}/working/plan`,
        {
          params: params.query,
        }
      );
      return resp.data;
    }
  );
}

export function useGetItem(params: { id: number | null }) {
  return useQuery(["plan", "item", params.id], async () => {
    if (!params.id) {
      return null;
    }

    const resp = await axios.get<Api.PlanItemResponse>(
      `${API_HOST}/working/plan/${params.id}`
    );
    return resp.data;
  });
}

export function useCreate() {
  return useMutation(
    ["plan", "create"],
    async (params: { data: Api.PlanCreateRequest }) => {
      const resp = await axios.post(`${API_HOST}/working/plan`, params.data);
      return resp.data;
    }
  );
}
