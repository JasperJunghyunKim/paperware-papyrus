import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  CheckPopbillIdResponse,
  PopbillCheckIdQuery,
} from "@/app/api/popbill/check/id/route";
import {
  CheckPopbillMemberResponse,
  PopbillCheckMemberQuery,
} from "@/app/api/popbill/check/member/route";
import { PopbillMemberCreateBody } from "@/app/api/popbill/member/route";
import { flatQueries } from "../util/parser";
import { GetPopbillCompanyInfoReseponse } from "@/app/api/popbill/member/[id]/route";
import { PopbillGetContactInfoResponse } from "../types/popbill";
import {
  GetPopbillContactInfoReseponse,
  PopbillMemberContactUpdateBody,
} from "@/app/api/popbill/member/[id]/contact/route";

export const useCheckPopbillId = (params: { query: PopbillCheckIdQuery }) =>
  useQuery(["popbill", "check", "id", flatQueries(params.query)], async () => {
    return await axios
      .get<CheckPopbillIdResponse>(`/api/popbill/check/id`, {
        params: params.query,
      })
      .then((res) => res.data);
  });

export const useCheckMember = (params: { query: PopbillCheckMemberQuery }) =>
  useQuery(
    ["popbill", "check", "member", flatQueries(params.query)],
    async () => {
      return await axios
        .get<CheckPopbillMemberResponse>(`/api/popbill/check/member`, {
          params: params.query,
        })
        .then((res) => res.data);
    }
  );

export const useGetItem = (params: { id: number | null }) =>
  useQuery(
    ["popbill", "check", "member", params.id],
    async () => {
      return await axios
        .get(`/api/popbill/member/${params.id}`)
        .then<GetPopbillCompanyInfoReseponse>((res) => res.data);
    },
    { enabled: !!params.id }
  );

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { body: PopbillMemberCreateBody }) =>
      await axios
        .post(`/api/popbill/member`, params.body)
        .then((res) => res.data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["popbill"]);
      },
    }
  );
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { id: number }) =>
      await axios
        .delete(`/api/popbill/member/${params.id}`)
        .then((res) => res.data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["popbill"]);
      },
    }
  );
};

export const useGetContact = (params: { id: number | null }) =>
  useQuery(
    ["popbill", "check", "member", "contact", params.id],
    async () => {
      return await axios
        .get<GetPopbillContactInfoReseponse>(
          `/api/popbill/member/${params.id}/contact`
        )
        .then((res) => res.data);
    },
    { enabled: !!params.id }
  );

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { id: number; body: PopbillMemberContactUpdateBody }) =>
      await axios
        .put(`/api/popbill/member/${params.id}/contact`, params.body)
        .then((res) => res.data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["popbill"]);
      },
    }
  );
};
