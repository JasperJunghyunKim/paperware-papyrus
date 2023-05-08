
import { Api } from "@/@shared";
import { API_HOST } from "@/common/const";
import axios from "axios";
import { useQuery } from "react-query";

export function useGetList(params: {
	query: Partial<Api.PartnerQuery>;
}) {
	return useQuery(
		["partner", "list", params.query.skip, params.query.take],
		async () => {
			const resp = await axios.get<Api.PartnerResponse>(
				`${API_HOST}/partner`,
				{
					params: params.query,
				}
			);
			return resp.data;
		}
	);
}
