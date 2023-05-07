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
    paperColorGroupId: number | null;
    paperColorId: number | null;
    paperPatternId: number | null;
    paperCertId: number | null;
    warehouseId: number | null;
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

    console.log('TEST', params);

    await this.prisma.$transaction(async (tx) => {
      const sg =
        (await tx.stockGroup.findFirst({
          where: {
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
        })) ??
        (await tx.stockGroup.create({
          data: {
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
        }));

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
