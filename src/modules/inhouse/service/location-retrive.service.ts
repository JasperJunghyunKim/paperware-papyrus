import { Injectable } from '@nestjs/common';
import { Selector } from 'src/common';
import { PrismaService } from 'src/core';

@Injectable()
export class LocationRetriveService {
  constructor(private prisma: PrismaService) {}

  async getList(skip: number, take: number) {
    return await this.prisma.location.findMany({
      select: Selector.LOCATION,
      skip,
      take,
    });
  }

  async getItem(id: number) {
    return await this.prisma.location.findUnique({
      select: Selector.LOCATION,
      where: { id },
    });
  }
}
