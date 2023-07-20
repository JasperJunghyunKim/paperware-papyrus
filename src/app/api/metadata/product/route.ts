import prisma from "@/lib/prisma";
import { handleApi } from "@/lib/server/handler";
import { parseSearchParams as parseSearchParams } from "@/lib/server/parser";
import { PaginationQuery, PaginationResponse } from "@/lib/types/pagination";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const getQuerySchema = z.object({
  skip: z.optional(z.coerce.number().min(0)),
  take: z.optional(z.coerce.number().min(1)),
  paperDomainId: z.optional(z.coerce.number()),
  paperGroupId: z.optional(z.coerce.number()),
  paperTypeId: z.optional(z.coerce.number()),
  manufacturerId: z.optional(z.coerce.number()),
});
export const GET = handleApi<GetProductListResponse>(async (req) => {
  const searchParams = await parseSearchParams(req);
  const query = await getQuerySchema.parseAsync(searchParams);

  const where: Prisma.ProductWhereInput = {
    paperDomainId: query.paperDomainId,
    paperGroupId: query.paperGroupId,
    paperTypeId: query.paperTypeId,
    manufacturerId: query.manufacturerId,
  };

  return {
    items: await prisma.product.findMany({
      select: {
        id: true,
        paperDomain: {
          select: { id: true, name: true },
        },
        paperGroup: {
          select: { id: true, name: true },
        },
        paperType: {
          select: { id: true, name: true },
        },
        manufacturer: {
          select: { id: true, name: true },
        },
      },
      where,
      skip: query.skip,
      take: query.take,
    }),
    total: await prisma.product.count({ where }),
  };
});

const createProductBodySchema = z.object({
  paperDomainId: z.number(),
  paperGroupId: z.number(),
  paperTypeId: z.number(),
  manufacturerId: z.number(),
});

export const POST = handleApi(async (req) => {
  const data = await createProductBodySchema.parseAsync(await req.json());

  await prisma.product.create({
    data: {
      paperDomainId: data.paperDomainId,
      paperGroupId: data.paperGroupId,
      paperTypeId: data.paperTypeId,
      manufacturerId: data.manufacturerId,
    },
  });
});

export type Product = {
  id: number;
  paperDomain: { id: number; name: string };
  paperGroup: { id: number; name: string };
  paperType: { id: number; name: string };
  manufacturer: { id: number; name: string };
};
export type CreateProductBody = {
  paperDomainId: number;
  paperGroupId: number;
  paperTypeId: number;
  manufacturerId: number;
};
export type GetProductListQuery = PaginationQuery & {
  paperDomainId?: number;
  paperGroupId?: number;
  paperTypeId?: number;
  manufacturerId?: number;
};
export type GetProductListResponse = PaginationResponse<Product>;
