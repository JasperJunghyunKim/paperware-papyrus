import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core";

@Injectable()
export class SalesChangeService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async createNormal(

    ) {

    }

}