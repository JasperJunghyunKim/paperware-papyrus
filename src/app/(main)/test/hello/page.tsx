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

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          {product.paperDomain.name} {product.paperGroup.name}
        </div>
      ))}
    </div>
  );
}
