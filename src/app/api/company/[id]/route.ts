import prisma from "@/lib/prisma";
import { ConflictError, NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { z } from "zod";
import { Company } from "../route";
import { CompanyType } from "@prisma/client";

const paramsSchema = z.object({
  id: z.string().transform((v) => parseInt(v)),
});

const putBodySchema = z.object({
  companyRegistrationNumber: z.string().length(10),
  businessName: z.string().min(1).max(20),
  companyType: z.union([
    z.literal("DISTRIBUTOR"),
    z.literal("MANUFACTURER"),
    z.literal("PRACTICAL"),
    z.literal("ETC"),
  ]),
  representative: z.string().min(1).max(20),
  phoneNo: z.string().min(1).max(20),
  faxNo: z.string().min(1).max(20).optional(),
  address: z.string().min(1).max(500),
  bizType: z.string().min(1).max(20),
  bizItem: z.string().min(1).max(20),
  startDate: z.date().optional(),
  memo: z.string().max(500).default(""),
});

export const GET = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await prisma.company.findUnique({
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
    where: { id: params.id },
  });

  if (!data) throw new NotFoundError();

  return data;
});

export const PUT = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await putBodySchema.parseAsync(await req.json());

  return await prisma.company.update({
    where: {
      id: params.id,
    },
    data: {
      companyRegistrationNumber: data.companyRegistrationNumber,
      businessName: data.businessName,
      companyType: data.companyType,
      representative: data.representative,
      phoneNo: data.phoneNo,
      faxNo: data.faxNo,
      address: data.address,
      bizType: data.bizType,
      bizItem: data.bizItem,
      startDate: data.startDate,
      memo: data.memo,
    },
  });
});

  
export const DELETE = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);

  const company = await prisma.company.findFirst({
      where: {
          id: params.id,
          managedById: null,
      }
  });
  if (!company) throw new NotFoundError('존재하지 않는 고객사');
  if (company.isDeleted) throw new ConflictError('이미 탈퇴 처리된 고객사');
  if (company.popbillId !== null) throw new ConflictError('팝빌연동 해제 필요');

  return await prisma.company.update({
    where: {
      id: params.id,
    },
    data: {
      isDeleted: true,
    },
  });
});

export type GetCompanyItemResponse = Company;
export type UpdateCompanyBody = {
  businessName: string;
  companyType: CompanyType;
  corporateRegistrationNumber?: string;
  representative: string;
  phoneNo: string;
  faxNo?: string;
  address: string;
  bizType: string;
  bizItem: string;
  startDate?: Date;
  memo?: string;
};
