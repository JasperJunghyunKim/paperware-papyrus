import { Injectable } from "@nestjs/common";
import { Prisma, StockEventStatus } from "@prisma/client";
import { PrismaService } from "src/core";
import { StockValidator } from "./stock.validator";
import { ulid } from 'ulid';

@Injectable()
export class StockChangeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stockValidator: StockValidator,
    ) { }

    async cacheStockQuantityTx(
        tx: Omit<PrismaService, "$on" | "$connect" | "$disconnect" | "$use" | "$transaction">,
        where: Prisma.StockWhereUniqueInput
    ) {
        const quantity = await tx.stockEvent.aggregate({
            _sum: {
                change: true,
            },
            where: {
                stockId: where.id,
                status: 'NORMAL',
            },
        });
        const quantityAvailable = await tx.stockEvent.aggregate({
            _sum: {
                change: true,
            },
            where: {
                stockId: where.id,
                OR: [
                    {
                        status: 'NORMAL',
                    },
                    {
                        status: 'PENDING',
                    },
                ],
            },
        });
        return await tx.stock.update({
            data: {
                cachedQuantity: quantity._sum.change,
                cachedQuantityAvailable: quantityAvailable._sum.change,
            },
            where,
        });
    }

    async create(data: Prisma.StockCreateInput, quantity: number) {
        const stock = await this.prisma.$transaction(async (tx) => {
            const packaging = await tx.packaging.findUnique({
                where: {
                    id: data.packaging.connect.id
                }
            });

            this.stockValidator.validateQuantity(packaging, quantity);

            console.log(111, data);
            const stock = await tx.stock.create({
                data,
                select: {
                    id: true,
                }
            });
            const stockEvent = await tx.stockEvent.create({
                data: {
                    stock: {
                        connect: {
                            id: stock.id
                        }
                    },
                    change: quantity,
                    status: StockEventStatus.NORMAL,
                },
                select: {
                    id: true,
                }
            });
            await tx.plan.create({
                data: {
                    planNo: ulid(),
                    companyId: data.company.connect.id,
                    stockEventOut: {
                        connect: {
                            id: stockEvent.id,
                        }
                    }
                }
            });

            await this.cacheStockQuantityTx(tx, {
                id: stock.id,
            });
        });

        return stock;
    }
}