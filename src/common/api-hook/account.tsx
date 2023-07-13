import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_HOST } from "../const";

export function useSignIn() {
  return useMutation(async (data: { username: string; password: string }) => {
    const response = await axios.post(`${API_HOST}/auth/signin`, data);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    return response.data;
  });
}

export function useGetMe() {
  return useQuery(
    ["me"],
    async () => {
      const response = await axios.get(`${API_HOST}/auth/me`);
      return response.data;
    },
    { staleTime: 5000 }
  );
}
