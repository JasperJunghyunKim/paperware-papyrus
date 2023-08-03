import prisma from "@/lib/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { PopbillGetCorpInfoResponse } from "@/lib/types/popbill";
import axios from "axios";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().transform((v) => parseInt(v)),
});

export const GET = handleApi<GetPopbillCompanyInfoReseponse>(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  
    const company = await prisma.company.findFirst({
        where: {
            id: params.id,
            managedById: null,
        }
    });
    if (!company) throw new NotFoundError('존재하지 않는 고객사');
    if (company.isDeleted) throw new ConflictError('이미 탈퇴 처리된 고객사');

    if(!company.popbillId) throw new ConflictError('팝빌 연동되어 있지 않는 고객사');

    const result = await new Promise((res, rej) => {
        axios.get(`${process.env.POPBILL_API_URL}/CorpInfo`, {
            params: {
                CorpNum: company.companyRegistrationNumber,
            }
        }).then(result => {
            res(result.data)
        }).catch(err => {
            console.log(err);
            rej(err)
        })
    });

    if (result instanceof Error) {
        throw new InternalServerError(result.message);
    }

    const _result = result as PopbillGetCorpInfoResponse;

    return {
        ceoName: _result.ceoname,
        companyName: _result.corpName,
        address: _result.addr,
        bizType: _result.bizType,
        bizItem: _result.bizClass,
    }
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

    if(!company.popbillId) throw new ConflictError('팝빌 연동되어 있지 않는 고객사');

    
});

export type GetPopbillCompanyInfoReseponse = {
    ceoName: string;
    companyName: string;
    address: string;
    bizType: string;
    bizItem: string;
}

