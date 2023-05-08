
import { Api } from "@/@shared";
import { API_HOST } from "@/common/const";
import axios from "axios";
import { useQuery } from "react-query";

export function useGetPaidList(params: {
	query: Partial<Api.PaidQuery>;
}) {
	return useQuery(
		["paid", "list", params.query.skip, params.query.take],
		async () => {
			const resp = await axios.get<Api.PaidListResponse>(
				`${API_HOST}/paid`,
				{
					params: params.query,
				}
			);
			return resp.data;
		}
	);
}

export function useGetCollectedList(params: {
	query: Partial<Api.CollectedQuery>;
}) {
	return useQuery(
		["collected", "list", params.query.skip, params.query.take],
		async () => {
			const resp = await axios.get<Api.CollectedListResponse>(
				`${API_HOST}/collected`,
				{
					params: params.query,
				}
			);
			return resp.data;
		}
	);
}
