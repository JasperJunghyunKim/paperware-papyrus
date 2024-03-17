import prisma from "@/lib/prisma";
import { ConflictError, NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { CompanyType } from "@prisma/client";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().transform((v) => parseInt(v)),
});
export const GET = handleApi(async (_req, context) => {
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
    where: { id: params.id },
  });

  if (!data) throw new NotFoundError();

  return data;
});

const putBodySchema = z.object({
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
  startDate: z.string().optional(),
  memo: z.string().max(500).default(""),
  admin: z.object({
    password: z
      .string()
      .min(10)
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
      .transform((x) => (x === "" ? undefined : x))
      .optional(),
  }),
});
export type UpdateCompanyBody = z.infer<typeof putBodySchema>;
export const PUT = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await putBodySchema.parseAsync(await req.json());

  return await prisma.company.update({
    where: {
      id: params.id,
    },
    data: {
      businessName: data.businessName,
      companyType: data.companyType,
      corporateRegistrationNumber: data.corporateRegistrationNumber,
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

export const DELETE = handleApi(async (_req, context) => {
  const params = await paramsSchema.parseAsync(context.params);

  const company = await prisma.company.findFirst({
    where: {
      id: params.id,
      managedById: null,
    },
  });
  if (!company) throw new NotFoundError("존재하지 않는 고객사");
  if (company.isDeleted) throw new ConflictError("이미 탈퇴 처리된 고객사");
  if (company.popbillId !== null) throw new ConflictError("팝빌연동 해제 필요");

  return await prisma.company.update({
    where: {
      id: params.id,
    },
    data: {
      isDeleted: true,
    },
  });
});
