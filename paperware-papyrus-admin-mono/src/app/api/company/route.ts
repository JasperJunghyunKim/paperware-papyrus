import { Util } from "@/lib";
import prisma from "@/lib/prisma";
import { handleApi } from "@/lib/server/handler";
import { parseSearchParams as parseSearchParams } from "@/lib/server/parser";
import { PaginationQuery, PaginationResponse } from "@/lib/types/pagination";
import { CompanyType, Prisma } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

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
export type GetCompanyListQuery = PaginationQuery &
  z.infer<typeof getQuerySchema>;
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
  popbillId: string | null;
  isDeleted: boolean;
  isActivated: boolean;
  _count: {
    user: number;
  };
  user: {
    username: string;
    name: string;
  }[];
};
export type GetCompanyListResponse = PaginationResponse<Company>;
export const GET = handleApi<GetCompanyListResponse>(async (req) => {
  const searchParams = await parseSearchParams(req);
  const query = await getQuerySchema.parseAsync(searchParams);

  const where: Prisma.CompanyWhereInput = {
    managedById: null,
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
        popbillId: true,
        isActivated: true,
        isDeleted: true,
        _count: {
          select: {
            user: true,
          },
        },
        user: {
          select: { username: true, name: true },
          where: { isAdmin: true },
        },
      },
      where,
      skip: query.skip,
      take: query.take,
      orderBy: {
        id: "asc",
      },
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
  faxNo: z
    .string()
    .max(20)
    .transform((x) => (x === "" ? undefined : x))
    .optional(),
  address: z.string().min(1).max(500),
  bizType: z.string().min(1).max(20),
  bizItem: z.string().min(1).max(20),
  invoiceCode: z.string().length(4),
  startDate: z.string().optional(),
  memo: z.string().max(500).default(""),
  admin: z.object({
    username: z.string().regex(/^[a-zA-Z0-9_]{1,20}$/),
    password: z
      .string()
      .min(10)
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/),
    name: z.string().min(1).max(20),
    phoneNo: z.string().min(1).max(20),
    email: z
      .string()
      .email()
      .transform((x) => (x === "" ? undefined : x))
      .optional(),
  }),
});
export type CreateCompanyBody = z.infer<typeof createCompanyBodySchema>;
export const POST = handleApi(async (req) => {
  const data = await createCompanyBodySchema.parseAsync(await req.json());

  const hashedPassword = await bcrypt.hash(
    data.admin.password,
    await bcrypt.genSalt()
  );
  await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
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
      select: { id: true },
    });
    await tx.user.create({
      data: {
        username: data.admin.username,
        password: hashedPassword,
        name: data.admin.name,
        phoneNo: data.admin.phoneNo,
        email: data.admin.email,
        companyId: company.id,
        isActivated: true,
        isAdmin: true,
      },
    });
  });
});
