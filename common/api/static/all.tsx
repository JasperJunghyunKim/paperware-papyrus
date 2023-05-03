import { API_HOST } from "@/common/const";
import { Record } from "@/common/protocol";
import axios from "axios";
import { useQuery } from "react-query";

export function useGetAll() {
  return useQuery(
    ["static-data"],
    async () => {
      const resp = await axios.get<Record.StaticData>(
        `${API_HOST}/static/data`
      );
      return resp.data;
    },
    {
      staleTime: 5 * 60 * 1000,
    }
  );
}
