import prisma from "@/lib/prisma";
import { handleApi } from "@/lib/server/handler";
import { parseSearchParams as parseSearchParams } from "@/lib/server/parser";
import { PaginationQuery, PaginationResponse } from "@/lib/types/pagination";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const getQuerySchema = z.object({
  skip: z.coerce.number().min(0),
  take: z.coerce.number().min(1).max(100),
  name: z.optional(z.string()),
});
export const GET = handleApi<GetPaperCertListResponse>(async (req) => {
  const searchParams = await parseSearchParams(req);
  const query = await getQuerySchema.parseAsync(searchParams);

  const where: Prisma.PaperCertWhereInput = {
    name: {
      contains: query.name,
    },
  };

  return {
    items: await prisma.paperCert.findMany({
      select: {
        id: true,
        name: true,
      },
      where,
      skip: query.skip,
      take: query.take,
    }),
    total: await prisma.paperCert.count({ where }),
  };
});

const createPaperCertBodySchema = z.object({
  name: z.string().min(1).max(20),
});

export const POST = handleApi(async (req) => {
  const data = await createPaperCertBodySchema.parseAsync(await req.json());

  await prisma.paperCert.create({
    data: {
      name: data.name,
    },
  });
});

export type PaperCert = {
  id: number;
  name: string;
};
export type CreatePaperCertBody = {
  name: string;
};
export type GetPaperCertListQuery = PaginationQuery & {
  name?: string;
};
export type GetPaperCertListResponse = PaginationResponse<PaperCert>;
