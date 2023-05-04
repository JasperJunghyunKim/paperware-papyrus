import { Module } from '@nestjs/common';
import { WarehouseChangeService } from './service/warehouse-change.service';
import { WarehouseRetriveService } from './service/warehouse-retrive.service';
import { WarehouseController } from './api/warehouse.controller';

@Module({
  providers: [WarehouseChangeService, WarehouseRetriveService],
  controllers: [WarehouseController],
})
export class InhouseModule {}
