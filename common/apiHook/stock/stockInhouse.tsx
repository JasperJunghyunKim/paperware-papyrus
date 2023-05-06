import { Api } from "@/@shared";
import { API_HOST } from "@/common/const";
import axios from "axios";
import { useMutation, useQuery } from "react-query";

export function useGetGroupList(params: {
  query: Partial<Api.StockGroupListQuery>;
}) {
  return useQuery(
    ["stockInhouse", "groupList", params.query.skip, params.query.take],
    async () => {
      const resp = await axios.get<Api.StockGroupListResponse>(
        `${API_HOST}/stock/group`,
        {
          params: params.query,
        }
      );
      return resp.data;
    }
  );
}

export function useCreate() {
  return useMutation(
    ["stockInhouse", "create"],
    async (params: { data: Api.StockCreateRequest }) => {
      const resp = await axios.post(`${API_HOST}/stock`, params.data);
      return resp.data;
    }
  );
}
