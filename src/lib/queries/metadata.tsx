import { UpdatePaperDomainBody } from "@/app/api/metadata/paper-domain/[id]/route";
import {
  CreatePaperDomainBody,
  GetPaperDomainListQuery,
} from "@/app/api/metadata/paper-domain/route";
import { GetPaperGroupListQuery } from "@/app/api/metadata/paper-group/route";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

namespace Template {
  export const useGetListQuery = (name: string, query: Record<string, any>) =>
    useQuery(
      [
        "metadata",
        name,
        "list",
        ...Object.entries(query).map((p) => `${p[0]}=${p[1]}`),
      ],
      async () =>
        await axios
          .get(`/api/metadata/${name}`, {
            params: query,
          })
          .then((res) => res.data)
    );

  export const useGetItemQuery = (name: string, id?: number) =>
    useQuery(
      ["metadata", name, "item", id],
      async () =>
        await axios.get(`/api/metadata/${name}/${id}`).then((res) => res.data),
      {
        enabled: id !== undefined,
      }
    );

  export const useCreateMutation = <T,>(name: string) => {
    const queryClient = useQueryClient();

    return useMutation(
      async (params: { data: T }) =>
        await axios
          .post(`/api/metadata/${name}`, params.data)
          .then((res) => res.data),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["metadata", name]);
        },
      }
    );
  };

  export const useUpdateMutation = <T,>(name: string) => {
    const queryClient = useQueryClient();

    return useMutation(
      async (params: { id: number; data: T }) =>
        await axios
          .put(`/api/metadata/${name}/${params.id}`, params.data)
          .then((res) => res.data),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["metadata", name]);
        },
      }
    );
  };
}

/*
 * PaperDomain
 * PaperGroup
 * PaperType
 * Manufacturer
 * PaperColorGroup
 * PaperColor
 * PaperPattern
 * PaperCert
 */

export const useGetPaperDomainList = (query: GetPaperDomainListQuery) =>
  Template.useGetListQuery("paper-domain", query ?? {});
export const useGetPaperDomainItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-domain", params.id);
export const useCreatePaperDomain = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("paper-domain");
export const useUpdatePaperDomain = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("paper-domain");

export const useGetPaperGroupList = (query: GetPaperGroupListQuery) =>
  Template.useGetListQuery("paper-group", query ?? {});
export const useGetPaperGroupItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-group", params.id);
export const useCreatePaperGroup = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("paper-group");
export const useUpdatePaperGroup = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("paper-group");

export const useGetPaperTypeList = (query: GetPaperGroupListQuery) =>
  Template.useGetListQuery("paper-type", query ?? {});
export const useGetPaperTypeItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-type", params.id);
export const useCreatePaperType = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("paper-type");
export const useUpdatePaperType = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("paper-type");

export const useGetManufacturerList = (query: GetPaperGroupListQuery) =>
  Template.useGetListQuery("manufacturer", query ?? {});
export const useGetManufacturerItem = (params: { id?: number }) =>
  Template.useGetItemQuery("manufacturer", params.id);
export const useCreateManufacturer = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("manufacturer");
export const useUpdateManufacturer = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("manufacturer");

export const useGetPaperColorGroupList = (query: GetPaperGroupListQuery) =>
  Template.useGetListQuery("paper-color-group", query ?? {});
export const useGetPaperColorGroupItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-color-group", params.id);
export const useCreatePaperColorGroup = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("paper-color-group");
export const useUpdatePaperColorGroup = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("paper-color-group");

export const useGetPaperColorList = (query: GetPaperGroupListQuery) =>
  Template.useGetListQuery("paper-color", query ?? {});
export const useGetPaperColorItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-color", params.id);
export const useCreatePaperColor = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("paper-color");
export const useUpdatePaperColor = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("paper-color");

export const useGetPaperPatternList = (query: GetPaperGroupListQuery) =>
  Template.useGetListQuery("paper-pattern", query ?? {});
export const useGetPaperPatternItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-pattern", params.id);
export const useCreatePaperPattern = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("paper-pattern");
export const useUpdatePaperPattern = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("paper-pattern");

export const useGetPaperCertList = (query: GetPaperGroupListQuery) =>
  Template.useGetListQuery("paper-cert", query ?? {});
export const useGetPaperCertItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-cert", params.id);
export const useCreatePaperCert = () =>
  Template.useCreateMutation<CreatePaperDomainBody>("paper-cert");
export const useUpdatePaperCert = () =>
  Template.useUpdateMutation<UpdatePaperDomainBody>("paper-cert");
