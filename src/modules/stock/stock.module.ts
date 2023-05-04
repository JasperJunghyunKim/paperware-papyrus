import { Module } from '@nestjs/common';
import { StockController } from './api/stock.controller';
import { StockRetriveService } from './service/stock-retrive.service';

@Module({
    controllers: [StockController],
    providers: [StockRetriveService]
})
export class StockModule { }
