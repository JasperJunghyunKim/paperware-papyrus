import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { AuthType } from 'src/modules/auth/auth.type';
import { BusinessRelationshipChangeService } from '../service/business-relationship-change.service';
import { BusinessRelationshipRetriveService } from '../service/business-relationship-retrive.service';
import {
  BusinessRelationshipCreateRequestDto,
  BusinessRelationshipListQueryDto,
} from './dto/business-relationship.request';
import { BusinessRelationshipListResponse } from 'src/@shared/api';
import { CompanyRetriveService } from '../service/company-retrive.service';

@Controller('inhouse/business-relation')
export class BusinessRelationshipController {
  constructor(
    private readonly retriveService: BusinessRelationshipRetriveService,
    private readonly changeService: BusinessRelationshipChangeService,
    private readonly companyRetriveService: CompanyRetriveService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getList(
    @Request() req: AuthType,
    @Query() query: BusinessRelationshipListQueryDto,
  ): Promise<BusinessRelationshipListResponse> {
    if (
      query.dstCompanyId !== req.user.companyId &&
      query.srcCompanyId !== req.user.companyId
    ) {
      throw new ForbiddenException();
    }

    const items = await this.retriveService.getList({
      skip: query.skip,
      take: query.take,
      dstCompanyId: query.dstCompanyId,
      srcCompanyId: query.srcCompanyId,
    });

    const total = await this.retriveService.getCount({
      dstCompanyId: query.dstCompanyId,
      srcCompanyId: query.srcCompanyId,
    });

    return {
      items,
      total,
    };
  }

  @Get(':srcCompanyId/:dstCompanyId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async get(
    @Request() req: AuthType,
    @Param('srcCompanyId') srcCompanyId: number,
    @Param('dstCompanyId') dstCompanyId: number,
  ) {
    if (
      dstCompanyId !== req.user.companyId &&
      srcCompanyId !== req.user.companyId
    ) {
      throw new ForbiddenException();
    }

    const data = await this.retriveService.getItem({
      srcCompanyId,
      dstCompanyId,
    });

    return data;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(
    @Request() req: AuthType,
    @Body() body: BusinessRelationshipCreateRequestDto,
  ) {
    const company = await this.companyRetriveService.getItem(body.srcCompanyId);

    if (
      company.managedById !== req.user.companyId &&
      body.srcCompanyId !== req.user.companyId
    ) {
      throw new ForbiddenException();
    }

    await this.changeService.create({
      srcCompanyId: req.user.companyId,
      dstCompanyId: body.dstCompanyId,
    });
  }
}
