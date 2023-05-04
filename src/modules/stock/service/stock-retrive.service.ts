import { Injectable } from "@nestjs/common";
import { PackagingType, Prisma, StockEventStatus } from "@prisma/client";
import { PrismaService } from "src/core";

interface StockGroupFromDB {
    warehouseId: number;

    packagingId: number;
    packagingName: string;
    packagingType: PackagingType;
    packagingPackA: number;
    packagingPackB: number;

    productId: number;
    paperDomainId: number;
    paperDomainName: string;
    paperGroupId: number;
    paperGroupName: string;
    manufacturerId: number;
    manufacturerName: string;
    paperTypeId: number;
    paperTypeName: string;

    grammage: number;
    sizeX: number;
    sizeY: number;

    paperColorGroupId: number;
    paperColorGroupName: string;
    paperColorId: number;
    paperColorName: string;
    paperPatternId: number;
    paperPatternName: string;
    paperCertId: number;
    paperCertName: string;

    totalQuantity: number;
    availableQuantity: number;
    total: bigint;
}

@Injectable()
export class StockRetriveService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getStockGroupList(companyId: number, skip: number, take: number) {
        const limit = take ? Prisma.sql`LIMIT ${skip}, ${take}` : Prisma.empty;

        const stockGroups: StockGroupFromDB[] = await this.prisma.$queryRaw`
            SELECT  
                    s.warehouseId AS warehouseId
                    , product.id AS productId
                    , paperDomain.id AS paperDomainId
                    , paperDomain.name AS paperDomainName
                    , manufacturer.id AS manufacturerId
                    , manufacturer.name AS manufacturerName
                    , paperGroup.id AS paperGroupId
                    , paperGroup.name AS paperGroupName
                    , paperType.id AS paperTypeId
                    , paperType.name AS paperTypeName
                    , packaging.id AS packagingId
                    , packaging.name AS packagingName
                    , packaging.type AS packagingType
                    , packaging.packA AS packagingPackA
                    , packaging.packB AS packagingPackB
                    , paperColorGroup.id AS paperColorGroupId
                    , paperColorGroup.name AS paperColorGroupName
                    , paperColor.id AS paperColorId
                    , paperColor.name AS paperColorName
                    , paperPattern.id AS paperPatternId
                    , paperPattern.name AS paperPatternName
                    , paperCert.id AS paperCertId
                    , paperCert.name AS paperCertName

                    , IFNULL(SUM(s.cachedQuantity), 0) / IF(packaging.type = ${PackagingType.ROLL}, 1000000, 1) AS totalQuantity
                    , IFNULL(SUM(s.cachedQuantityAvailable), 0) / IF(packaging.type = ${PackagingType.ROLL}, 1000000, 1) AS availableQuantity
                    , COUNT(1) OVER() AS total

              FROM Stock            AS s
              JOIN StockEvent       AS se               ON se.stockId = s.id
              
            # 메타데이터
              JOIN Product          AS product          ON product.id = s.productId
              JOIN PaperDomain      AS paperDomain      ON paperDomain.id = product.paperDomainId
              JOIN Manufacturer     AS manufacturer     ON manufacturer.id = product.manufacturerId
              JOIN PaperGroup       AS paperGroup       ON paperGroup.id = product.paperGroupId
              JOIN PaperType        AS paperType        ON paperType.id = product.paperTypeId
              JOIN Packaging        AS packaging        ON packaging.id = s.packagingId
         LEFT JOIN PaperColorGroup  AS paperColorGroup  ON paperColorGroup.id = s.paperColorGroupId
         LEFT JOIN PaperColor       AS paperColor       ON paperColor.id = s.paperColorId
         LEFT JOIN PaperPattern     AS paperPattern     ON paperPattern.id = s.paperPatternId
         LEFT JOIN PaperCert        AS paperCert        ON paperCert.id = s.paperCertId


             WHERE s.companyId = ${companyId}
               AND se.status IN (${StockEventStatus.NORMAL}, ${StockEventStatus.PENDING})

             GROUP BY s.warehouseId
                    , s.productId
                    , s.packagingId
                    , s.grammage
                    , s.sizeX
                    , s.sizeY
                    , s.paperColorGroupId
                    , s.paperColorId
                    , s.paperPatternId
                    , s.paperCertId
            HAVING totalQuantity != 0 OR availableQuantity != 0
            
             ${limit}
        `;

        const total = stockGroups.length === 0 ? 0 : Number(stockGroups[0].total);
        for (const stockGroup of stockGroups) {
            stockGroup.totalQuantity = Number(stockGroup.totalQuantity);
            stockGroup.availableQuantity = Number(stockGroup.availableQuantity);
            delete stockGroup.total;
        }

        return { stockGroups, total };
    }
}