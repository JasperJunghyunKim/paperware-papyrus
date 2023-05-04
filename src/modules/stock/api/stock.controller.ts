import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { StockCreateRequestDto } from "./dto/stock.request";

@Controller('/stock')
export class StockController {

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() dto: StockCreateRequestDto) {
        console.log(dto);
    }
}