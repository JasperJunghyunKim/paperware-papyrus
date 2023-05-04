import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core';
import { LOCATION } from '../constants/selector';

@Injectable()
export class LocationRetriveService {
  constructor(private prisma: PrismaService) {}

  async getLocations(skip: number, take: number) {
    return await this.prisma.location.findMany({
      select: LOCATION,
      skip,
      take,
    });
  }

  async getLocation(id: number) {
    return await this.prisma.location.findUnique({
      select: LOCATION,
      where: { id },
    });
  }
}
