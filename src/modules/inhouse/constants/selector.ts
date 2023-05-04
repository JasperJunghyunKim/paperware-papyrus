import { Prisma } from '@prisma/client';

export const WAREHOUSE = {
  id: true,
  name: true,
  code: true,
  isPublic: true,
  companyId: true,
  address: true,
} satisfies Prisma.WarehouseSelect;

export const LOCATION = {
  id: true,
  name: true,
  code: true,
  isPublic: true,
  companyId: true,
  address: true,
} satisfies Prisma.LocationSelect;
