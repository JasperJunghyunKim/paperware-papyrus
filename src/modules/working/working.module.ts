import { Module } from '@nestjs/common';
import { PlanChangeService } from './service/plan-change.service';
import { PlanRetriveService } from './service/plan-retrive.service';
import { PlanController } from './api/plan.controller';

@Module({
  providers: [PlanChangeService, PlanRetriveService],
  controllers: [PlanController],
})
export class WorkingModule {}
