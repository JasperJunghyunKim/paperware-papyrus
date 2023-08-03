import prisma from "@/lib/prisma";
import { ConflictError, InternalServerError, NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { PopbillDefaultResponse } from "@/lib/types/popbill";
import axios from "axios";
import { z } from "zod";
import queryString from 'query-string';

const queriesSchema = z.object({
    id: z.string(),
});

export const GET = handleApi(async (req, context) => {
    const search = new URL(req.url).search;
    const data = await queriesSchema.parseAsync(queryString.parse(search));

    const result = await new Promise((res, rej) => {
        axios.get(`${process.env.POPBILL_API_URL}/IDCheck`, {
            params: {
                ID: data.id,
            }
        }).then(result => {
            res(result.data)
        }).catch(err => {
            rej(err)
        })
    });

    if (result instanceof Error) {
        throw new InternalServerError();
    }
    console.log(result);

    const _result = result as PopbillDefaultResponse;
    return {
        isUsed: _result.code === 1,
    }    
  });

