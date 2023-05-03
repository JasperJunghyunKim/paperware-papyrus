import { Module } from '@nestjs/common';
import { InternalService } from './internal.service';
import { InternalController } from './internal.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { StaticService } from '../static/static.service';

@Module({
  providers: [InternalService, PrismaService, StaticService],
  controllers: [InternalController],
})
export class InternalModule {}
