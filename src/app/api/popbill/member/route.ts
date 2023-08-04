
import prisma from "@/lib/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { PopbillDefaultResponse } from "@/lib/types/popbill";
import axios from "axios";
import { z } from "zod";

const createBodySchema = z.object({
    companyId: z.number(),
    id: z.string().min(6).max(50),
    password: z.string().min(8).max(20),
    ceoName: z.string().min(1).max(100),
    companyName: z.string().min(1).max(200),
    address: z.string().min(1).max(200),
    bizType: z.string().min(1).max(100),
    bizItem: z.string().min(1).max(100),
    contactName: z.string().min(1).max(100),
    contactEmail: z.string().email().min(1).max(100),
    contactPhoneNo: z.string().min(1).max(20),
});

export const POST = handleApi(async (req, context) => {
    const data = await createBodySchema.parseAsync(await req.json());

    const company = await prisma.company.findFirst({
        where: {
            id: data.companyId,
            managedById: null,
        }
    });
    if (!company) throw new NotFoundError('존재하지 않는 고객사');
    if (company.isDeleted) throw new ConflictError('이미 탈퇴 처리된 고객사');
    if (company.popbillId) throw new ConflictError('이미 팝빌 연동되어 있는 고객사');

    const body = {
        id: data.id,
        password: data.password,
        companyRegistrationNumber: company.companyRegistrationNumber,
        ceoName: data.ceoName,
        companyName: data.companyName,
        address: data.address,
        bizType: data.bizType,
        bizItem: data.bizItem,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhoneNo: data.contactPhoneNo,
    };

    const result = await new Promise((res, rej) => {
        axios.post(`${process.env.POPBILL_API_URL}/TaxinvoiceService/JoinMember`, body).then(result => {
            res(result.data)
        }).catch(err => {
            console.log(err.message);
            rej(err.message)
        })
    });

    if (result instanceof Error) {
        throw new InternalServerError(result.message);
    }

    const _result = result as PopbillDefaultResponse;
    if (_result.code === 1) {
        await prisma.company.update({
            where: {
                id: data.companyId,
            },
            data: {
                popbillId: data.id,
            }
        });
    } else {
        throw new InternalServerError(_result.message);
    }
});