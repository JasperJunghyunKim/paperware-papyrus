
import { Api } from "@/@shared";
import { API_HOST } from "@/common/const";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useGetPaidItem(params: { id: number | false }) {
	return useQuery(["paid", "cash", params.id], async () => {
		if (params.id === false) {
			return null;
		}
		const resp = await axios.get<Api.PaidByCashItemResponse>(
			`${API_HOST}/paid/${params.id}/cash`
		);
		return resp.data;
	});
}

export function usePaidCreate() {
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
				await queryClient.invalidateQueries(["paid", "cash"]);
			},
		}
	);
}

export function usePaidUpdate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.PaidByCashUpdateRequest; id: number }) => {
			const resp = await axios.put(
				`${API_HOST}/paid/${params.id}/cash`,
				params.data
			);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["paid", "cash"]);
			},
		}
	);
}

export function usePaidDelete() {
	const queryClient = useQueryClient();

	return useMutation(
		async (id: number) => {
			const resp = await axios.delete(`${API_HOST}/paid/${id}}/cash`);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["paid", "cash"]);
			},
		}
	);
}

// ----------------------------------------------------------------------

export function useGetCollectedItem(params: { id: number | false }) {
	return useQuery(["collected", "cash", params.id], async () => {
		if (params.id === false) {
			return null;
		}
		const resp = await axios.get<Api.CollectedByCashItemResponse>(
			`${API_HOST}/collected/${params.id}/cash`
		);
		return resp.data;
	});
}

export function useCollectedCreate() {
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

export function useCollectedUpdate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.CollectedByCashUpdateRequest; id: number }) => {
			const resp = await axios.put(
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

export function useCollectedDelete() {
	const queryClient = useQueryClient();

	return useMutation(
		async (id: number) => {
			const resp = await axios.delete(`${API_HOST}/collected/${id}}/cash`);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["collected", "cash"]);
			},
		}
	);
}
