import prisma from "@/lib/prisma";
import { ConflictError, NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().transform((v) => parseInt(v)),
});

const patchBodySchema = z.object({
    isActivated: z.boolean(),
});
  

export const PATCH =  handleApi(async (req, context) => {
    const params = await paramsSchema.parseAsync(context.params);
    const data = await patchBodySchema.parseAsync(await req.json());

    const company = await prisma.company.findFirst({
        where: {
            id: params.id,
            managedById: null,
        }
    });
    if (!company) throw new NotFoundError('존재하지 않는 고객사');
    if (company.isDeleted) throw new ConflictError('이미 탈퇴 처리된 고객사');
  
    return await prisma.company.update({
      where: {
        id: params.id,
      },
      data: {
        isActivated: data.isActivated,
      },
    });
  });