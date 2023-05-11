
import { Api } from "@/@shared";
import { Enum } from "@/@shared/models";
import { API_HOST } from "@/common/const";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useGetByCashPaidItem(params: { id: number | false, method: Enum.Method | null }) {
	return useQuery(["paid", "cash", params.id, params.method], async () => {
		if (params.id === false) {
			return null;
		}
		if (params.method === null || params.method !== 'CASH') {
			return null
		}
		const resp = await axios.get<Api.PaidByCashItemResponse>(
			`${API_HOST}/paid/${params.id}/cash`
		);
		return resp.data;
	});
}

export function useByCashPaidCreate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.PaidByCashCreateRequest }) => {
			const resp = await axios.post(
				`${API_HOST}/paid/cash`,
				params.data
			);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["paid", "list"]);
			},
		}
	);
}

export function useByCashPaidUpdate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.PaidByCashUpdateRequest; id: number }) => {
			const resp = await axios.patch(
				`${API_HOST}/paid/${params.id}/cash`,
				params.data
			);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["paid", "list"]);
			},
		}
	);
}

export function useByCashPaidDelete() {
	const queryClient = useQueryClient();

	return useMutation(
		async (id: number) => {
			const resp = await axios.delete(`${API_HOST}/paid/${id}/cash`);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["paid", "list"]);
			},
		}
	);
}

// ----------------------------------------------------------------------

export function useGetByCashCollectedItem(params: { id: number | false, method: Enum.Method | null }) {
	return useQuery(["collected", "cash", params.id], async () => {
		if (params.id === false) {
			return null;
		}
		if (params.method === null || params.method !== 'ETC') {
			return null
		}
		const resp = await axios.get<Api.CollectedByCashItemResponse>(
			`${API_HOST}/collected/${params.id}/cash`
		);
		return resp.data;
	});
}

export function useByCashCollectedCreate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.CollectedByCashCreateRequest }) => {
			const resp = await axios.post(
				`${API_HOST}/collected/cash`,
				params.data
			);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["collected", "cash"]);
			},
		}
	);
}

export function useByCashCollectedUpdate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.CollectedByCashUpdateRequest; id: number }) => {
			const resp = await axios.patch(
				`${API_HOST}/collected/${params.id}/cash`,
				params.data
			);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["collected", "cash"]);
			},
		}
	);
}

export function useByCashCollectedDelete() {
	const queryClient = useQueryClient();

	return useMutation(
		async (id: number) => {
			const resp = await axios.delete(`${API_HOST}/collected/${id}/cash`);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["collected", "cash"]);
			},
		}
	);
}
