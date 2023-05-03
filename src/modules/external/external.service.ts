import { Record, Selector, Util } from '@common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ulid } from 'ulid';

@Injectable()
export class ExternalService {
  constructor(private prisma: PrismaService) {}

  // #region Company
  async findCompanyWithCompanyRegistrationNumber(
    companyRegistrationNumber: string,
  ) {
    return await this.prisma.company.findUnique({
      where: {
        companyRegistrationNumber,
      },
    });
  }
  // #endregion

  // #region BusinessRelationshipRequest

  async getBusinessRelationshipRequest(
    where: Prisma.BusinessRelationshipRequestWhereUniqueInput,
  ) {
    return await this.prisma.businessRelationshipRequest.findUnique({
      where,
      select: {
        srcCompany: true,
        dstCompany: true,
      },
    });
  }

  async getBusinessRelationshipRequestList(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BusinessRelationshipRequestWhereInput;
    orderBy?: Prisma.BusinessRelationshipRequestOrderByWithRelationInput;
  }): Promise<Record.BusinessRelationshipRequest[]> {
    const { skip, take, where, orderBy } = params;
    return await this.prisma.businessRelationshipRequest.findMany({
      skip,
      take,
      where,
      orderBy,
      select: Selector.BUSINESS_RELATIONSHIP_REQUEST,
    });
  }

  async getBusinessRelationshipRequestCount(params: {
    where?: Prisma.BusinessRelationshipRequestWhereInput;
  }) {
    const { where } = params;
    return await this.prisma.businessRelationshipRequest.count({
      where,
    });
  }

  async upsertBusinessRelationshipRequest(
    data: Prisma.BusinessRelationshipRequestCreateInput,
  ) {
    return await this.prisma.businessRelationshipRequest.upsert({
      where: {
        srcCompanyId_dstCompanyId: {
          srcCompanyId: data.srcCompany.connect.id,
          dstCompanyId: data.dstCompany.connect.id,
        },
      },
      create: data,
      update: data,
      select: Selector.BUSINESS_RELATIONSHIP_REQUEST,
    });
  }

  async updateBusinessRelationshipRequest(params: {
    where: Prisma.BusinessRelationshipRequestWhereUniqueInput;
    data: Prisma.BusinessRelationshipRequestUpdateInput;
  }) {
    return await this.prisma.businessRelationshipRequest.update({
      where: params.where,
      data: params.data,
      select: {
        srcCompany: {
          select: {
            id: true,
            businessName: true,
            companyRegistrationNumber: true,
            phoneNo: true,
            faxNo: true,
            email: true,
          },
        },
        dstCompany: {
          select: {
            id: true,
            businessName: true,
            companyRegistrationNumber: true,
            phoneNo: true,
            faxNo: true,
            email: true,
          },
        },
        status: true,
        memo: true,
      },
    });
  }

  // #endregion

  // #region Vendor Stock

  async getVendorStockList(params: {
    dstCompanyId: number;
    skip?: number;
    take?: number;
    where?: Prisma.StockWhereInput;
    orderBy?: Prisma.StockOrderByWithRelationInput;
  }): Promise<Record.VendorStock[]> {
    console.log(params.dstCompanyId, params.where);
    const data = await this.prisma.stock.findMany({
      skip: params.skip,
      take: params.take,
      where: {
        ...params.where,
        company: {
          srcBusinessRelationship: {
            some: {
              dstCompanyId: params.dstCompanyId,
            },
          },
        },
      },
      select: Selector.VENDOR_STOCK,
    });

    return data;
  }

  async getVendorStockCount(params: {
    dstCompanyId: number;
    where?: Prisma.StockWhereInput;
  }) {
    const { dstCompanyId, where } = params;
    return await this.prisma.stock.count({
      where: {
        ...where,
        company: {
          dstBusinessRelationship: {
            some: {
              dstCompanyId,
            },
          },
        },
      },
    });
  }

  // #endregion

  // #region Stored Stock

  async getStoredStockList(params: {
    warehouseCompanyId: number;
    skip?: number;
    take?: number;
    where?: Prisma.StockWhereInput;
    orderBy?: Prisma.StockOrderByWithRelationInput;
  }): Promise<Record.VendorStock[]> {
    const data = await this.prisma.stock.findMany({
      skip: params.skip,
      take: params.take,
      where: {
        ...params.where,
        warehouse: {
          companyId: params.warehouseCompanyId,
        },
      },
      select: Selector.VENDOR_STOCK,
    });

    return data;
  }

  async getStoredStockCount(params: {
    warehouseCompanyId: number;
    where?: Prisma.StockWhereInput;
  }): Promise<number> {
    const { where } = params;
    return await this.prisma.stock.count({
      where: {
        ...where,
        warehouse: {
          companyId: params.warehouseCompanyId,
        },
      },
    });
  }

  // #endregion

  // #region Order

  async getOrderList(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }): Promise<Record.Order[]> {
    const { skip, take, where, orderBy } = params;
    const data = await this.prisma.order.findMany({
      skip,
      take,
      where,
      orderBy,
      select: Selector.ORDER,
    });

    return data.map<Record.Order>((item) => {
      return {
        ...item,
        wantedDate: Util.dateToIso8601(item.wantedDate),
      };
    });
  }

  async getOrderCount(params: {
    where?: Prisma.OrderWhereInput;
  }): Promise<number> {
    const { where } = params;
    return await this.prisma.order.count({
      where,
    });
  }

  async getOrder(where: Prisma.OrderWhereUniqueInput): Promise<Record.Order> {
    const data = await this.prisma.order.findUnique({
      where,
      select: Selector.ORDER,
    });

    return {
      ...data,
      wantedDate: Util.dateToIso8601(data.wantedDate),
    };
  }

  async createOrder(data: Prisma.OrderCreateInput): Promise<Record.Order> {
    const inserted = await this.prisma.order.create({
      data,
      select: Selector.ORDER,
    });

    return {
      ...inserted,
      wantedDate: Util.dateToIso8601(inserted.wantedDate),
    };
  }

  async updateOrder(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Record.Order> {
    const updated = await this.prisma.order.update({
      where: params.where,
      data: params.data,
      select: Selector.ORDER,
    });

    return {
      ...updated,
      wantedDate: Util.dateToIso8601(updated.wantedDate),
    };
  }

  async acceptOrder(orderId: number): Promise<void> {
    this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'ACCEPTED',
        },
      });

      const orderStocks = await tx.orderStock.findMany({
        where: {
          orderId,
        },
        include: {
          paperCert: true,
        },
      });

      await Promise.all(
        orderStocks.map(async (orderStock) => {
          const plan = await tx.plan.create({
            data: {
              planNo: ulid(),
              companyId: order.dstCompanyId,
              orderStock: {
                connect: {
                  id: orderStock.id,
                },
              },
            },
          });

          // 구매처의 도착 예정 목록에 추가
          await tx.stock.create({
            data: {
              serial: ulid(),
              companyId: order.srcCompanyId,
              productId: orderStock.productId,
              packagingId: orderStock.packagingId,
              grammage: orderStock.grammage,
              sizeX: orderStock.sizeX,
              sizeY: orderStock.sizeY,
              paperColorGroupId: orderStock.paperColorGroupId,
              paperColorId: orderStock.paperColorId,
              paperPatternId: orderStock.paperPatternId,
              paperCert: {
                connect: orderStock.paperCert.map((p) => ({
                  id: p.id,
                })),
              },
              cachedQuantityAvailable: orderStock.quantity,
              stockEvent: {
                create: {
                  change: orderStock.quantity,
                  status: 'PENDING',
                  orderStock: {
                    connect: {
                      id: orderStock.id,
                    },
                  },
                },
              },
            },
          });

          // 판매자의 출고 예정 목록에 추가
          await tx.stock.create({
            data: {
              serial: ulid(),
              companyId: order.dstCompanyId,
              productId: orderStock.productId,
              packagingId: orderStock.packagingId,
              grammage: orderStock.grammage,
              sizeX: orderStock.sizeX,
              sizeY: orderStock.sizeY,
              paperColorGroupId: orderStock.paperColorGroupId,
              paperColorId: orderStock.paperColorId,
              paperPatternId: orderStock.paperPatternId,
              paperCert: {
                connect: orderStock.paperCert.map((p) => ({
                  id: p.id,
                })),
              },
              cachedQuantityAvailable: orderStock.quantity,
              stockEvent: {
                create: {
                  change: orderStock.quantity,
                  status: 'PENDING',
                  planOut: {
                    connect: {
                      id: plan.id,
                    },
                  },
                },
              },
            },
          });
        }),
      );
    });
  }

  // #endregion

  // #region OrderStock

  async getOrderStockList(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderStockWhereInput;
    orderBy?: Prisma.OrderStockOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return await this.prisma.orderStock.findMany({
      skip,
      take,
      where,
      orderBy,
      select: Selector.ORDER_STOCK,
    });
  }

  async getOrderStockCount(params: { where?: Prisma.OrderStockWhereInput }) {
    const { where } = params;
    return await this.prisma.orderStock.count({
      where,
    });
  }

  async getOrderStock(where: Prisma.OrderStockWhereUniqueInput) {
    return await this.prisma.orderStock.findUnique({
      where,
      select: Selector.ORDER_STOCK,
    });
  }

  async createOrderStock(data: Prisma.OrderStockCreateInput) {
    return await this.prisma.orderStock.create({
      data,
      select: Selector.ORDER_STOCK,
    });
  }

  async updateOrderStock(params: {
    where: Prisma.OrderStockWhereUniqueInput;
    data: Prisma.OrderStockUpdateInput;
  }) {
    return await this.prisma.orderStock.update({
      where: params.where,
      data: params.data,
      select: Selector.ORDER_STOCK,
    });
  }

  // #endregion
}
