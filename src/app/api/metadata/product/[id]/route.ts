import prisma from "@/lib/prisma";
import { NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { z } from "zod";
import { Product } from "../route";

const paramsSchema = z.object({
  id: z.string().transform((v) => parseInt(v)),
});

export const GET = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!data) throw new NotFoundError();

  return data;
});

const putBodySchema = z.object({
  paperDomainId: z.number(),
  paperGroupId: z.number(),
  paperTypeId: z.number(),
  manufacturerId: z.number(),
});

export const PUT = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await putBodySchema.parseAsync(await req.json());

  return await prisma.product.update({
    where: {
      id: params.id,
    },
    data: {
      paperDomainId: data.paperDomainId,
      paperGroupId: data.paperGroupId,
      paperTypeId: data.paperTypeId,
      manufacturerId: data.manufacturerId,
    },
  });
});

export type GetProductItemResponse = Product;
export type UpdateProductBody = {
  paperDomainId: number;
  paperGroupId: number;
  paperTypeId: number;
  manufacturerId: number;
};
