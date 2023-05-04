import { Injectable } from '@nestjs/common';
import { Selector } from 'src/common';
import { PrismaService } from 'src/core';

@Injectable()
export class WarehouseRetriveService {
  constructor(private prisma: PrismaService) {}

  async getList(skip: number, take: number) {
    return await this.prisma.warehouse.findMany({
      select: Selector.WAREHOUSE,
      skip,
      take,
    });
  }

  async getItem(id: number) {
    return await this.prisma.warehouse.findUnique({
      select: Selector.WAREHOUSE,
      where: { id },
    });
  }
}
