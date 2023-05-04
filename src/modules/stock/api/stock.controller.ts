import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { AuthType } from "src/modules/auth/auth.type";
import { StockChangeService } from "../service/stock-change.service";
import { StockCreateRequestDto } from "./dto/stock.request";
import { ulid } from 'ulid';

@Controller('/stock')
export class StockController {
    constructor(
        private readonly stockChangeService: StockChangeService,
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    async create(@Request() req: AuthType, @Body() dto: StockCreateRequestDto): Promise<any> {
        await this.stockChangeService.create({
            serial: ulid(),
            warehouse: dto.warehouseId ? {
                connect: {
                    id: dto.warehouseId
                }
            } : undefined,
            company: {
                connect: {
                    id: req.user.companyId,
                }
            },
            product: {
                connect: {
                    id: dto.productId,
                }
            },
            grammage: dto.grammage,
            sizeX: dto.sizeX,
            sizeY: dto.sizeY,
            packaging: {
                connect: {
                    id: dto.packagingId,
                }
            },
            paperColorGroup: dto.paperColorGroupId ? {
                connect: {
                    id: dto.paperColorGroupId,
                }
            } : undefined,
            paperColor: dto.paperColorId ? {
                connect: {
                    id: dto.paperColorId,
                }
            } : undefined,
            paperPattern: dto.paperPatternId ? {
                connect: {
                    id: dto.paperPatternId,
                }
            } : undefined,
            paperCert: dto.paperCertId ? {
                connect: {
                    id: dto.paperCertId,
                }
            } : undefined,
        }, dto.quantity);
    }
}