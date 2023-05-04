import { Injectable } from '@nestjs/common';
import { Model } from 'src/@shared';
import { Selector } from 'src/common';
import { PrismaService } from 'src/core';

@Injectable()
export class VirtualCompanyRetriveService {
  constructor(private prisma: PrismaService) {}

  async getList(params: {
    skip: number;
    take: number;
  }): Promise<Array<Model.Company>> {
    return await this.prisma.company.findMany({
      select: Selector.COMPANY,
      skip: params.skip,
      take: params.take,
    });
  }

  async getCount(params: { companyId: number }): Promise<number> {
    return await this.prisma.location.count({
      where: {
        companyId: params.companyId,
      },
    });
  }

  async getItem(id: number): Promise<Model.Company> {
    return await this.prisma.company.findUnique({
      select: Selector.COMPANY,
      where: { id },
    });
  }
}
