import { Module } from '@nestjs/common';
import { PlanChangeService } from './service/plan-change.service';
import { PlanRetriveService } from './service/plan-retrive.service';
import { WorkingController } from './api/plan.controller';

@Module({
  providers: [PlanChangeService, PlanRetriveService],
  controllers: [WorkingController],
})
export class WorkingModule {}
