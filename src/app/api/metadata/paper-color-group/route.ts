import prisma from "@/lib/prisma";
import { handleApi } from "@/lib/server/handler";
import { parseSearchParams as parseSearchParams } from "@/lib/server/parser";
import { PaginationQuery, PaginationResponse } from "@/lib/types/pagination";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const getQuerySchema = z.object({
  skip: z.optional(z.coerce.number().min(0)),
  take: z.optional(z.coerce.number().min(1)),
  name: z.optional(z.string()),
});
export const GET = handleApi<GetPaperColorGroupListResponse>(async (req) => {
  const searchParams = await parseSearchParams(req);
  const query = await getQuerySchema.parseAsync(searchParams);

  const where: Prisma.PaperColorGroupWhereInput = {
    name: {
      contains: query.name,
    },
  };

  return {
    items: await prisma.paperColorGroup.findMany({
      select: {
        id: true,
        name: true,
        isDiscontinued: true,
      },
      where,
      skip: query.skip,
      take: query.take,
    }),
    total: await prisma.paperColorGroup.count({ where }),
  };
});

const createPaperColorGroupBodySchema = z.object({
  name: z.string().min(1).max(20),
});

export const POST = handleApi(async (req) => {
  const data = await createPaperColorGroupBodySchema.parseAsync(
    await req.json()
  );

  await prisma.paperColorGroup.create({
    data: {
      name: data.name,
    },
  });
});

export type PaperColorGroup = {
  id: number;
  name: string;
  isDiscontinued: boolean;
};
export type CreatePaperColorGroupBody = {
  name: string;
};
export type GetPaperColorGroupListQuery = PaginationQuery & {
  name?: string;
};
export type GetPaperColorGroupListResponse =
  PaginationResponse<PaperColorGroup>;
