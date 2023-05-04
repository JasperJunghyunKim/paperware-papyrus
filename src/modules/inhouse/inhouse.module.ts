import { Module } from '@nestjs/common';
import { WarehouseChangeService } from './service/warehouse-change.service';
import { WarehouseRetriveService } from './service/warehouse-retrive.service';
import { WarehouseController } from './api/warehouse.controller';
import { LocationController } from './api/location.controller';
import { LocationChangeService } from './service/location-change.service';
import { LocationRetriveService } from './service/location-retrive.service';

@Module({
  providers: [
    WarehouseChangeService,
    WarehouseRetriveService,
    LocationChangeService,
    LocationRetriveService,
  ],
  controllers: [WarehouseController, LocationController],
})
export class InhouseModule {}
