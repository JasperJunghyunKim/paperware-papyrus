
import { Api } from "@/@shared";
import { Enum } from "@/@shared/models";
import { API_HOST } from "@/common/const";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function useGetByEtcPaidItem(params: { id: number | false, method: Enum.Method | null }) {
	return useQuery(["paid", "etc", params.id, params.method], async () => {
		if (params.id === false) {
			return null;
		}
		if (params.method === null || params.method !== 'ETC') {
			return null
		}
		const resp = await axios.get<Api.PaidByEtcItemResponse>(
			`${API_HOST}/paid/${params.id}/etc`
		);
		return resp.data;
	});
}

export function useByEtcPaidCreate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.PaidByCashCreateRequest }) => {
			const resp = await axios.post(
				`${API_HOST}/paid/etc`,
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

export function useByEtcPaidUpdate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.PaidByCashUpdateRequest; id: number }) => {
			const resp = await axios.patch(
				`${API_HOST}/paid/${params.id}/etc`,
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

export function useByEtcPaidDelete() {
	const queryClient = useQueryClient();

	return useMutation(
		async (id: number) => {
			const resp = await axios.delete(`${API_HOST}/paid/${id}/etc`);
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

export function useGetByEtcCollectedItem(params: { id: number | false }) {
	return useQuery(["collected", "etc", params.id], async () => {
		if (params.id === false) {
			return null;
		}
		const resp = await axios.get<Api.CollectedByCashItemResponse>(
			`${API_HOST}/collected/${params.id}/etc`
		);
		return resp.data;
	});
}

export function useByEtcCollectedCreate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.CollectedByCashCreateRequest }) => {
			const resp = await axios.post(
				`${API_HOST}/collected/etc`,
				params.data
			);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["collected", "etc"]);
			},
		}
	);
}

export function useByEtcCollectedUpdate() {
	const queryClient = useQueryClient();

	return useMutation(
		async (params: { data: Api.CollectedByCashUpdateRequest; id: number }) => {
			const resp = await axios.patch(
				`${API_HOST}/collected/${params.id}/etc`,
				params.data
			);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["collected", "etc"]);
			},
		}
	);
}

export function useByEtcCollectedDelete() {
	const queryClient = useQueryClient();

	return useMutation(
		async (id: number) => {
			const resp = await axios.delete(`${API_HOST}/collected/${id}/etc`);
			return resp.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["collected", "etc"]);
			},
		}
	);
}
