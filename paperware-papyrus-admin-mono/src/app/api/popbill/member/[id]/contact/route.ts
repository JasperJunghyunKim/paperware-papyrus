import prisma from "@/lib/prisma";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { PopbillGetContactInfoResponse } from "@/lib/types/popbill";
import axios from "axios";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().transform((v) => parseInt(v)),
});

const putContactSchema = z.object({
  contactName: z.string().min(1).max(100),
  contactEmail: z.string().min(1).max(100).email(),
  contactPhoneNo: z.string().min(1).max(20),
});
export type PopbillMemberContactUpdateBody = z.infer<typeof putContactSchema>;

export const GET = handleApi<GetPopbillContactInfoReseponse>(
  async (req, context) => {
    const params = await paramsSchema.parseAsync(context.params);

    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
        managedById: null,
      },
    });
    if (!company) throw new NotFoundError("존재하지 않는 고객사");
    if (company.isDeleted) throw new ConflictError("이미 탈퇴 처리된 고객사");

    if (!company.popbillId)
      throw new ConflictError("팝빌 연동되어 있지 않는 고객사");

    const result = await new Promise((res, rej) => {
      axios
        .get(
          `${process.env.POPBILL_API_URL}/TaxinvoiceService/GetContact?companyRegistrationNumber=${company.companyRegistrationNumber}`
        )
        .then((result) => {
          res(result.data);
        })
        .catch((err) => {
          console.log(err);
          rej(err);
        });
    });

    if (result instanceof Error) {
      throw new InternalServerError(result.message);
    }

    const _result = result as PopbillGetContactInfoResponse;

    return {
      id: _result.id,
      contactName: _result.personName,
      contactEmail: _result.email,
      contactPhoneNo: _result.tel,
    };
  }
);

export const PUT = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const body = await putContactSchema.parseAsync(await req.json());

  const company = await prisma.company.findFirst({
    where: {
      id: params.id,
      managedById: null,
    },
  });
  if (!company) throw new NotFoundError("존재하지 않는 고객사");
  if (company.isDeleted) throw new ConflictError("이미 탈퇴 처리된 고객사");

  if (!company.popbillId)
    throw new ConflictError("팝빌 연동되어 있지 않는 고객사");

  const result = await new Promise((res, rej) => {
    axios
      .put(`${process.env.POPBILL_API_URL}/TaxinvoiceService/UpdateContact`, {
        companyRegistrationNumber: company.companyRegistrationNumber,
        popbillId: company.popbillId,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhoneNo: body.contactPhoneNo,
      })
      .then((result) => {
        res(result.data);
      })
      .catch((err) => {
        console.log(err);
        rej(err);
      });
  });

  if (result instanceof Error) {
    throw new InternalServerError(result.message);
  }
});

export type GetPopbillContactInfoReseponse = {
  id: string;
  contactName: string;
  contactPhoneNo: string;
  contactEmail: string;
};
