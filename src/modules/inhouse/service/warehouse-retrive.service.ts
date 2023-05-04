import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core';
import { WAREHOUSE } from '../constants/selector';

@Injectable()
export class WarehouseRetriveService {
  constructor(private prisma: PrismaService) {}

  async getList(skip: number, take: number) {
    return await this.prisma.warehouse.findMany({
      select: WAREHOUSE,
      skip,
      take,
    });
  }

  async getItem(id: number) {
    return await this.prisma.warehouse.findUnique({
      select: WAREHOUSE,
      where: { id },
    });
  }
}
