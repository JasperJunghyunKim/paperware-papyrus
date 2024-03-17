import prisma from "@/lib/prisma";
import { NotFoundError } from "@/lib/server/error";
import { handleApi } from "@/lib/server/handler";
import { z } from "zod";
import { Manufacturer } from "../route";

const paramsSchema = z.object({
  id: z.string().transform((v) => parseInt(v)),
});

const putBodySchema = z.object({
  name: z.string().min(1).max(20),
  isDiscontinued: z.boolean(),
});

export const GET = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await prisma.manufacturer.findUnique({
    select: {
      id: true,
      name: true,
      isDiscontinued: true,
    },
    where: { id: params.id },
  });

  if (!data) throw new NotFoundError();

  return data;
});

export const PUT = handleApi(async (req, context) => {
  const params = await paramsSchema.parseAsync(context.params);
  const data = await putBodySchema.parseAsync(await req.json());

  return await prisma.manufacturer.update({
    where: {
      id: params.id,
    },
    data: {
      name: data.name,
      isDiscontinued: data.isDiscontinued,
    },
  });
});

export type GetManufacturerItemResponse = Manufacturer;
export type UpdateManufacturerBody = {
  name: string;
  isDiscontinued: boolean;
};
