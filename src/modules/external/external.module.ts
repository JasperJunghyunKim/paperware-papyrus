import { Module } from '@nestjs/common';
import { ExternalService } from './external.service';
import { ExternalController } from './external.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { InternalService } from '../internal/internal.service';

@Module({
  providers: [ExternalService, InternalService, PrismaService],
  controllers: [ExternalController],
})
export class ExternalModule {}
