import axios from "axios";
import { useQuery } from "react-query";
import {
  CheckPopbillIdResponse,
  PopbillCheckIdQuery,
} from "@/app/api/popbill/check/id/route";
import { CheckPopbillMemberResponse } from "@/app/api/popbill/check/member/route";
import { PopbillMemberCreateBody } from "@/app/api/popbill/member/route";
import { flatQueries } from "../util/parser";

export const useCheckPopbillId = (params: { query: PopbillCheckIdQuery }) =>
  useQuery(["popbill", "check", "id", flatQueries(params.query)], async () => {
    return await axios
      .get<CheckPopbillIdResponse>(`/api/popbill/check/id`, {
        params: params.query,
      })
      .then((res) => res.data);
  });

export const useCheckMember = (params: { query: PopbillMemberCreateBody }) =>
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
