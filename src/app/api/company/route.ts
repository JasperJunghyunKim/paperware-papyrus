import prisma from "@/lib/prisma";
import { handleApi } from "@/lib/server/handler";
import { parseSearchParams as parseSearchParams } from "@/lib/server/parser";
import { PaginationQuery, PaginationResponse } from "@/lib/types/pagination";
import { CompanyType, Prisma } from "@prisma/client";
import { z } from "zod";

const getQuerySchema = z.object({
  skip: z.optional(z.coerce.number().min(0)),
  take: z.optional(z.coerce.number().min(1)),
  invoiceCode: z.optional(z.string()),
  businessName: z.optional(z.string()),
  companyRegistrationNumber: z.optional(z.string()),
  representative: z.optional(z.string()),
  bizType: z.optional(z.string()),
  bizItem: z.optional(z.string()),
});
export const GET = handleApi<GetCompanyListResponse>(async (req) => {
  const searchParams = await parseSearchParams(req);
  const query = await getQuerySchema.parseAsync(searchParams);

  const where: Prisma.CompanyWhereInput = {
    businessName: {
      contains: query.businessName,
    },
    companyRegistrationNumber: {
      contains: query.companyRegistrationNumber,
    },
    representative: {
      contains: query.representative,
    },
    bizType: {
      contains: query.bizType,
    },
    bizItem: {
      contains: query.bizItem,
    },
  };

  return {
    items: await prisma.company.findMany({
      select: {
        id: true,
        companyRegistrationNumber: true,
        businessName: true,
        companyType: true,
        corporateRegistrationNumber: true,
        representative: true,
        phoneNo: true,
        faxNo: true,
        address: true,
        bizType: true,
        bizItem: true,
        invoiceCode: true,
        startDate: true,
        memo: true,
        _count: {
          select: {
            user: true,
          },
        },
      },
      where,
      skip: query.skip,
      take: query.take,
    }),
    total: await prisma.company.count({ where }),
  };
});

const createCompanyBodySchema = z.object({
  companyRegistrationNumber: z.string().length(10),
  businessName: z.string().min(1).max(20),
  companyType: z.union([
    z.literal("DISTRIBUTOR"),
    z.literal("MANUFACTURER"),
    z.literal("PRACTICAL"),
    z.literal("ETC"),
  ]),
  corporateRegistrationNumber: z.string().length(13).optional(),
  representative: z.string().min(1).max(20),
  phoneNo: z.string().min(1).max(20),
  faxNo: z.string().min(1).max(20).optional(),
  address: z.string().min(1).max(500),
  bizType: z.string().min(1).max(20),
  bizItem: z.string().min(1).max(20),
  invoiceCode: z.string().length(4),
  startDate: z.date().optional(),
  memo: z.string().max(500).default(""),
});

export const POST = handleApi(async (req) => {
  const data = await createCompanyBodySchema.parseAsync(await req.json());

  await prisma.company.create({
    data: {
      companyRegistrationNumber: data.companyRegistrationNumber,
      businessName: data.businessName,
      companyType: data.companyType,
      corporateRegistrationNumber: data.corporateRegistrationNumber,
      representative: data.representative,
      phoneNo: data.phoneNo,
      faxNo: data.faxNo,
      address: data.address,
      bizType: data.bizType,
      bizItem: data.bizItem,
      invoiceCode: data.invoiceCode,
      startDate: data.startDate,
      memo: data.memo,
    },
  });
});

export type Company = {
  id: number;
  companyRegistrationNumber: string;
  businessName: string;
  companyType: CompanyType;
  corporateRegistrationNumber: string | null;
  representative: string;
  phoneNo: string;
  faxNo: string | null;
  address: string;
  bizType: string;
  bizItem: string;
  invoiceCode: string;
  startDate?: Date;
  memo: string;
};
export type CreateCompanyBody = {
  companyRegistrationNumber: string;
  businessName: string;
  companyType: CompanyType;
  corporateRegistrationNumber?: string;
  representative: string;
  phoneNo: string;
  faxNo?: string;
  address: string;
  bizType: string;
  bizItem: string;
  invoiceCode: string;
  startDate?: Date;
  memo?: string;
};
export type GetCompanyListQuery = PaginationQuery & {
  invoiceCode?: string;
  businessName?: string;
  companyRegistrationNumber?: string;
  representative?: string;
  bizType?: string;
  bizItem?: string;
};
export type GetCompanyListResponse = PaginationResponse<Company>;
