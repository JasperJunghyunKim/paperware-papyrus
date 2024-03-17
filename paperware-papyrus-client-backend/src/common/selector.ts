import { Prisma } from '@prisma/client';

export const USER = {
  id: true,
  companyId: true,
  username: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;

export const COMPANY = {
  id: true,
  businessName: true,
  companyRegistrationNumber: true,
  invoiceCode: true,
  representative: true,
  address: true,
  phoneNo: true,
  faxNo: true,
  email: true,
  managedById: true,
} satisfies Prisma.CompanySelect;

export const BUSINESS_RELATIONSHIP = {
  srcCompany: {
    select: COMPANY,
  },
  dstCompany: {
    select: COMPANY,
  },
} satisfies Prisma.BusinessRelationshipSelect;

export const BUSINESS_RELATIONSHIP_REQUEST = {
  srcCompany: {
    select: COMPANY,
  },
  dstCompany: {
    select: COMPANY,
  },
  status: true,
  memo: true,
} satisfies Prisma.BusinessRelationshipRequestSelect;

export const WAREHOUSE = {
  id: true,
  name: true,
  code: true,
  isPublic: true,
  company: {
    select: COMPANY,
  },
  address: true,
} satisfies Prisma.WarehouseSelect;

export const LOCATION = {
  id: true,
  name: true,
  code: true,
  isPublic: true,
  company: {
    select: COMPANY,
  },
  address: true,
} satisfies Prisma.LocationSelect;

export const PAPER_DOMAIN = {
  id: true,
  name: true,
} satisfies Prisma.PaperDomainSelect;

export const MANUFACTURER = {
  id: true,
  name: true,
} satisfies Prisma.ManufacturerSelect;

export const PAPER_GROUP = {
  id: true,
  name: true,
} satisfies Prisma.PaperGroupSelect;

export const PAPER_TYPE = {
  id: true,
  name: true,
} satisfies Prisma.PaperTypeSelect;

export const PRODUCT = {
  id: true,
  paperDomain: true,
  manufacturer: true,
  paperGroup: true,
  paperType: true,
} satisfies Prisma.ProductSelect;

export const PACKAGING = {
  id: true,
  name: true,
  type: true,
  packA: true,
  packB: true,
} satisfies Prisma.PackagingSelect;

export const PAPER_COLOR_GROUP = {
  id: true,
  name: true,
} satisfies Prisma.PaperColorGroupSelect;

export const PAPER_COLOR = {
  id: true,
  name: true,
} satisfies Prisma.PaperColorSelect;

export const PAPER_PATTERN = {
  id: true,
  name: true,
} satisfies Prisma.PaperPatternSelect;

export const PAPER_CERT = {
  id: true,
  name: true,
} satisfies Prisma.PaperCertSelect;

export const ORDER_STOCK_TRADE_PRICE = {
  // orderId: true,
  companyId: true,
  officialPriceType: true,
  officialPrice: true,
  discountType: true,
  // s: true,
} satisfies Prisma.OrderStockTradePriceSelect;

export const STOCK = {
  id: true,
  companyId: true,
  serial: true,
  warehouse: {
    select: WAREHOUSE,
  },
  product: {
    select: {
      id: true,
      paperDomain: {
        select: PAPER_DOMAIN,
      },
      manufacturer: {
        select: MANUFACTURER,
      },
      paperGroup: {
        select: PAPER_GROUP,
      },
      paperType: {
        select: PAPER_TYPE,
      },
    },
  },
  packaging: {
    select: PACKAGING,
  },
  grammage: true,
  sizeX: true,
  sizeY: true,
  paperColorGroup: {
    select: PAPER_COLOR_GROUP,
  },
  paperColor: {
    select: PAPER_COLOR,
  },
  paperPattern: {
    select: PAPER_PATTERN,
  },
  paperCert: {
    select: PAPER_CERT,
  },
  // officialPriceType: true,
  // officialPrice: true,
  // discountType: true,
  // stockPrice: true,
  cachedQuantity: true,
  cachedQuantityAvailable: true,
} satisfies Prisma.StockSelect;

export const VENDOR_STOCK = {
  id: true,
  company: {
    select: COMPANY,
  },
  warehouse: {
    select: WAREHOUSE,
  },
  product: {
    select: {
      id: true,
      paperDomain: {
        select: PAPER_DOMAIN,
      },
      manufacturer: {
        select: MANUFACTURER,
      },
      paperGroup: {
        select: PAPER_GROUP,
      },
      paperType: {
        select: PAPER_TYPE,
      },
    },
  },
  packaging: {
    select: PACKAGING,
  },
  grammage: true,
  sizeX: true,
  sizeY: true,
  paperColorGroup: {
    select: PAPER_COLOR_GROUP,
  },
  paperColor: {
    select: PAPER_COLOR,
  },
  paperPattern: {
    select: PAPER_PATTERN,
  },
  paperCert: {
    select: PAPER_CERT,
  },
  // officialPriceType: true,
  // officialPrice: true,
  // discountType: true,
  // stockPrice: true,
  cachedQuantity: true,
  cachedQuantityAvailable: true,
} satisfies Prisma.StockSelect;

export const STOCK_EVENT = {
  id: true,
  stockId: true,
  status: true,
  stock: {
    select: STOCK,
  },
} satisfies Prisma.StockEventSelect;

export const STOCK_GROUP = {
  id: true,
  company: {
    select: COMPANY,
  },
  product: {
    select: PRODUCT,
  },
  packaging: {
    select: PACKAGING,
  },
  grammage: true,
  sizeX: true,
  sizeY: true,
  paperColorGroup: {
    select: PAPER_COLOR_GROUP,
  },
  paperColor: {
    select: PAPER_COLOR,
  },
  paperPattern: {
    select: PAPER_PATTERN,
  },
  paperCert: {
    select: PAPER_CERT,
  },
  warehouse: {
    select: WAREHOUSE,
  },
} satisfies Prisma.StockGroupSelect;

export const STOCK_GROUP_EVENT = {
  id: true,
  stockGroup: {
    select: STOCK_GROUP,
  },
  change: true,
  status: true,
} satisfies Prisma.StockGroupEventSelect;

export const ORDER = {
  id: true,
  orderNo: true,
  srcCompany: true,
  dstCompany: true,
  status: true,
  memo: true,
  wantedDate: true,
  isEntrusted: true,
} satisfies Prisma.OrderSelect;

export const TASK_CONVERTING = {
  taskId: true,
  sizeX: true,
  sizeY: true,
  memo: true,
} satisfies Prisma.TaskConvertingSelect;

export const TASK_GUILLOTINE = {
  taskId: true,
  sizeX: true,
  sizeY: true,
  memo: true,
} satisfies Prisma.TaskGuillotineSelect;

export const TASK_QUANTITY = {
  taskId: true,
  quantity: true,
} satisfies Prisma.TaskQuantitySelect;

export const PLAN = {
  id: true,
  planNo: true,
  company: {
    select: COMPANY,
  },
  status: true,
  createdAt: true,
  targetStockGroupEvent: {
    select: STOCK_GROUP_EVENT,
  },
} satisfies Prisma.PlanSelect;

export const TASK = {
  id: true,
  taskNo: true,
  plan: {
    select: PLAN,
  },
  status: true,
  type: true,
  parentTaskId: true,
  taskConverting: { select: TASK_CONVERTING },
  taskGuillotine: { select: TASK_GUILLOTINE },
  taskQuantity: { select: TASK_QUANTITY },
} satisfies Prisma.TaskSelect;

export const ORDER_STOCK = {
  id: true,
  order: {
    select: ORDER,
  },
  dstLocation: {
    select: LOCATION,
  },
  plan: {
    select: PLAN,
  },
} satisfies Prisma.OrderStockSelect;

export const SHIPPING = {
  id: true,
  shippingNo: true,
  company: {
    select: COMPANY,
  },
} satisfies Prisma.ShippingSelect;

export const INVOICE = {
  id: true,
  shipping: {
    select: SHIPPING,
  },
  invoiceNo: true,
  // stockEvent: {
  //   select: STOCK_EVENT,
  // },
} satisfies Prisma.InvoiceSelect;
