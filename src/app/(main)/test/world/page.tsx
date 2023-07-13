import { Page } from "@/components/layout";
import prisma from "@/lib/prisma";

export default async function Component() {
  const products = await prisma.product.findMany({
    include: {
      paperDomain: true,
      paperType: true,
      paperGroup: true,
      manufacturer: true,
    },
  });

  return <Page title="Hello">ASDF</Page>;
}
