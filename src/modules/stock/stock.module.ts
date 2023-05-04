import { Module } from '@nestjs/common';
import { StockController } from './api/stock.controller';
import { StockChangeService } from './service/stock-change.service';
import { StockRetriveService } from './service/stock-retrive.service';

@Module({
    controllers: [StockController],
    providers: [StockRetriveService, StockChangeService]
})
export class StockModule { }
