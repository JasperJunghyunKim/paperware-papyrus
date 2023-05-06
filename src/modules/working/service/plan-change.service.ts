import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core';
import { ulid } from 'ulid';

@Injectable()
export class PlanChangeService {
  constructor(private prisma: PrismaService) {}

  async createPlan(params: {
    companyId: number;
    productId: number;
    packagingId: number;
    grammage: number;
    sizeX: number;
    sizeY: number;
    paperColorGroupId: number;
    paperColorId: number;
    paperPatternId: number;
    paperCertId: number;
    warehouseId: number;
    memo: string;
    quantity: number;
  }) {
    const {
      companyId,
      productId,
      packagingId,
      grammage,
      sizeX,
      sizeY,
      paperColorGroupId,
      paperColorId,
      paperPatternId,
      paperCertId,
      warehouseId,
      memo,
      quantity,
    } = params;

    await this.prisma.$transaction(async (tx) => {
      const sg = await tx.stockGroup.upsert({
        where: {
          productId_packagingId_grammage_sizeX_sizeY_paperColorGroupId_paperColorId_paperPatternId_paperCertId_warehouseId_companyId:
            {
              productId,
              packagingId,
              grammage,
              sizeX,
              sizeY,
              paperColorGroupId,
              paperColorId,
              paperPatternId,
              paperCertId,
              warehouseId,
              companyId,
            },
        },
        create: {
          companyId,
          productId,
          packagingId,
          grammage,
          sizeX,
          sizeY,
          paperColorGroupId,
          paperColorId,
          paperPatternId,
          paperCertId,
          warehouseId,
        },
        update: {},
      });

      const sge = await tx.stockGroupEvent.create({
        data: {
          stockGroupId: sg.id,
          change: quantity,
          status: 'PENDING',
        },
      });

      await tx.plan.create({
        data: {
          company: {
            connect: {
              id: companyId,
            },
          },
          planNo: ulid(),
          memo,
          targetStockGroupEvent: {
            connect: {
              id: sge.id,
            },
          },
        },
      });
    });
  }
}
