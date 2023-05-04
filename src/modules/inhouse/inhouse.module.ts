import { Module } from '@nestjs/common';
import { WarehouseChangeService } from './service/warehouse-change.service';
import { WarehouseRetriveService } from './service/warehouse-retrive.service';

@Module({
  providers: [WarehouseChangeService, WarehouseRetriveService],
})
export class InhouseModule {}
