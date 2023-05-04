import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VirtualCompanyCreateRequest } from 'src/@shared/api/inhouse/virtual-company.request';
import { VirtualCompanyChangeService } from 'src/modules/inhouse/service/virtual-company-change.service';
import { VirtualCompanyRetriveService } from 'src/modules/inhouse/service/virtual-company-retrive.service';
import {
  VirtualCompanyListQueryDto,
  VirtualCompanyUpdateRequestDto,
} from './dto/virtual-company.request';
import { AuthType } from 'src/modules/auth/auth.type';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { VirtualCompanyListResponse } from 'src/@shared/api';

@Controller('inhouse/virtual-company')
export class VirtualCompanyController {
  constructor(
    private readonly virtualCompanyRetriveService: VirtualCompanyRetriveService,
    private readonly virtualCompanyChangeService: VirtualCompanyChangeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getList(
    @Request() req: AuthType,
    @Query() query: VirtualCompanyListQueryDto,
  ): Promise<VirtualCompanyListResponse> {
    const items = await this.virtualCompanyRetriveService.getList({
      skip: query.skip,
      take: query.take,
    });

    const total = await this.virtualCompanyRetriveService.getCount({
      companyId: req.user.companyId,
    });

    return {
      items,
      total,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async get(@Request() req: AuthType, @Param('id') id: number) {
    const virtualCompany = await this.virtualCompanyRetriveService.getItem(id);

    if (virtualCompany.managedById !== req.user.companyId) {
      throw new ForbiddenException();
    }

    return virtualCompany;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(
    @Request() req: AuthType,
    @Body() body: VirtualCompanyCreateRequest,
  ) {
    await this.virtualCompanyChangeService.create({
      businessName: body.businessName,
      phoneNo: body.phoneNo,
      faxNo: body.faxNo,
      email: body.email,
      managedBy: {
        connect: {
          id: req.user.companyId,
        },
      },
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async update(
    @Request() req: AuthType,
    @Param('id') id: number,
    @Body() body: VirtualCompanyUpdateRequestDto,
  ) {
    const virtualCompany = await this.virtualCompanyRetriveService.getItem(id);

    if (virtualCompany.managedById !== req.user.companyId) {
      throw new ForbiddenException();
    }

    await this.virtualCompanyChangeService.update(id, {
      businessName: body.businessName,
      phoneNo: body.phoneNo,
      faxNo: body.faxNo,
      email: body.email,
    });
  }
}
