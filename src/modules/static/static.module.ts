import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Module({
  controllers: [StaticController],
  providers: [StaticService, PrismaService],
})
export class StaticModule {}
