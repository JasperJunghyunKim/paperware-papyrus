import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { UpdateManufacturerBody } from "@/app/api/metadata/manufacturer/[id]/route";
import {
  CreateManufacturerBody,
  GetManufacturerListQuery,
} from "@/app/api/metadata/manufacturer/route";
import { UpdatePaperCertBody } from "@/app/api/metadata/paper-cert/[id]/route";
import {
  CreatePaperCertBody,
  GetPaperCertListQuery,
} from "@/app/api/metadata/paper-cert/route";
import { UpdatePaperColorGroupBody } from "@/app/api/metadata/paper-color-group/[id]/route";
import {
  CreatePaperColorGroupBody,
  GetPaperColorGroupListQuery,
} from "@/app/api/metadata/paper-color-group/route";
import { UpdatePaperColorBody } from "@/app/api/metadata/paper-color/[id]/route";
import {
  CreatePaperColorBody,
  GetPaperColorListQuery,
} from "@/app/api/metadata/paper-color/route";
import { UpdatePaperDomainBody } from "@/app/api/metadata/paper-domain/[id]/route";
import {
  CreatePaperDomainBody,
  GetPaperDomainListQuery,
} from "@/app/api/metadata/paper-domain/route";
import { UpdatePaperGroupBody } from "@/app/api/metadata/paper-group/[id]/route";
import {
  CreatePaperGroupBody,
  GetPaperGroupListQuery,
} from "@/app/api/metadata/paper-group/route";
import { UpdatePaperPatternBody } from "@/app/api/metadata/paper-pattern/[id]/route";
import {
  CreatePaperPatternBody,
  GetPaperPatternListQuery,
} from "@/app/api/metadata/paper-pattern/route";
import { UpdatePaperTypeBody } from "@/app/api/metadata/paper-type/[id]/route";
import {
  CreatePaperTypeBody,
  GetPaperTypeListQuery,
} from "@/app/api/metadata/paper-type/route";
import { UpdateProductBody } from "@/app/api/metadata/product/[id]/route";
import {
  CreateProductBody,
  GetProductListQuery,
} from "@/app/api/metadata/product/route";

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
  Template.useCreateMutation<CreatePaperGroupBody>("paper-group");
export const useUpdatePaperGroup = () =>
  Template.useUpdateMutation<UpdatePaperGroupBody>("paper-group");

export const useGetPaperTypeList = (query: GetPaperTypeListQuery) =>
  Template.useGetListQuery("paper-type", query ?? {});
export const useGetPaperTypeItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-type", params.id);
export const useCreatePaperType = () =>
  Template.useCreateMutation<CreatePaperTypeBody>("paper-type");
export const useUpdatePaperType = () =>
  Template.useUpdateMutation<UpdatePaperTypeBody>("paper-type");

export const useGetManufacturerList = (query: GetManufacturerListQuery) =>
  Template.useGetListQuery("manufacturer", query ?? {});
export const useGetManufacturerItem = (params: { id?: number }) =>
  Template.useGetItemQuery("manufacturer", params.id);
export const useCreateManufacturer = () =>
  Template.useCreateMutation<CreateManufacturerBody>("manufacturer");
export const useUpdateManufacturer = () =>
  Template.useUpdateMutation<UpdateManufacturerBody>("manufacturer");

export const useGetPaperColorGroupList = (query: GetPaperColorGroupListQuery) =>
  Template.useGetListQuery("paper-color-group", query ?? {});
export const useGetPaperColorGroupItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-color-group", params.id);
export const useCreatePaperColorGroup = () =>
  Template.useCreateMutation<CreatePaperColorGroupBody>("paper-color-group");
export const useUpdatePaperColorGroup = () =>
  Template.useUpdateMutation<UpdatePaperColorGroupBody>("paper-color-group");

export const useGetPaperColorList = (query: GetPaperColorListQuery) =>
  Template.useGetListQuery("paper-color", query ?? {});
export const useGetPaperColorItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-color", params.id);
export const useCreatePaperColor = () =>
  Template.useCreateMutation<CreatePaperColorBody>("paper-color");
export const useUpdatePaperColor = () =>
  Template.useUpdateMutation<UpdatePaperColorBody>("paper-color");

export const useGetPaperPatternList = (query: GetPaperPatternListQuery) =>
  Template.useGetListQuery("paper-pattern", query ?? {});
export const useGetPaperPatternItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-pattern", params.id);
export const useCreatePaperPattern = () =>
  Template.useCreateMutation<CreatePaperPatternBody>("paper-pattern");
export const useUpdatePaperPattern = () =>
  Template.useUpdateMutation<UpdatePaperPatternBody>("paper-pattern");

export const useGetPaperCertList = (query: GetPaperCertListQuery) =>
  Template.useGetListQuery("paper-cert", query ?? {});
export const useGetPaperCertItem = (params: { id?: number }) =>
  Template.useGetItemQuery("paper-cert", params.id);
export const useCreatePaperCert = () =>
  Template.useCreateMutation<CreatePaperCertBody>("paper-cert");
export const useUpdatePaperCert = () =>
  Template.useUpdateMutation<UpdatePaperCertBody>("paper-cert");

export const useGetProductList = (query: GetProductListQuery) =>
  Template.useGetListQuery("product", query ?? {});
export const useGetProductItem = (params: { id?: number }) =>
  Template.useGetItemQuery("product", params.id);
export const useCreateProduct = () =>
  Template.useCreateMutation<CreateProductBody>("product");
export const useUpdateProduct = () =>
  Template.useUpdateMutation<UpdateProductBody>("product");
