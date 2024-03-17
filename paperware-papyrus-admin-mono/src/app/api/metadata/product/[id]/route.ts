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
  const data: Product | null = await prisma.product.findUnique({
    select: {
      id: true,
      paperDomain: {
        select: {
          id: true,
          name: true,
          isDiscontinued: true,
        },
      },
      paperGroup: {
        select: {
          id: true,
          name: true,
          isDiscontinued: true,
        },
      },
      paperType: {
        select: {
          id: true,
          name: true,
          isDiscontinued: true,
        },
      },
      manufacturer: {
        select: {
          id: true,
          name: true,
          isDiscontinued: true,
        },
      },
      isDiscontinued: true,
    },
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
  isDiscontinued: z.boolean(),
});

export const PUT = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await putBodySchema.parseAsync(await req.json());

  const paperDomain = await prisma.paperDomain.findUnique({
    where: { id: data.paperDomainId },
  });
  const paperGroup = await prisma.paperGroup.findUnique({
    where: { id: data.paperGroupId },
  });
  const paperType = await prisma.paperType.findUnique({
    where: { id: data.paperTypeId },
  });
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: data.manufacturerId },
  });

  if (
    data.isDiscontinued &&
    (!paperDomain?.isDiscontinued ||
      !paperGroup?.isDiscontinued ||
      !paperType?.isDiscontinued ||
      !manufacturer?.isDiscontinued)
  ) {
    throw new Error("단종되지 않은 메타데이터 속성이 포함되어 있습니다.");
  }

  return await prisma.product.update({
    where: {
      id: params.id,
    },
    data: {
      paperDomainId: data.paperDomainId,
      paperGroupId: data.paperGroupId,
      paperTypeId: data.paperTypeId,
      manufacturerId: data.manufacturerId,
      isDiscontinued: data.isDiscontinued,
    },
  });
});

export type GetProductItemResponse = Product;
export type UpdateProductBody = {
  paperDomainId: number;
  paperGroupId: number;
  paperTypeId: number;
  manufacturerId: number;
  isDiscontinued: boolean;
};
