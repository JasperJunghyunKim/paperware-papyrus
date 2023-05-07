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
import { PlanChangeService } from '../service/plan-change.service';
import { PlanRetriveService } from '../service/plan-retrive.service';
import { PlanCreateRequestDto, PlanListQueryDto } from './dto/plan.request';

@Controller('working')
export class PlanController {
  constructor(
    private readonly planChangeService: PlanChangeService,
    private readonly planRetriveService: PlanRetriveService,
  ) {}

  @Get('plan')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getPlanList(
    @Request() req: AuthType,
    @Query() query: PlanListQueryDto,
  ) {
    const items = await this.planRetriveService.getPlanList({
      skip: query.skip,
      take: query.take,
      companyId: req.user.companyId,
    });

    const total = await this.planRetriveService.getPlanListCount({
      companyId: req.user.companyId,
    });

    return {
      items,
      total,
    };
  }

  @Get('plan/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getPlanById(@Request() req: AuthType, @Param('id') id: number) {
    const plan = await this.planRetriveService.getPlanById(id);

    if (plan.company.id !== req.user.companyId) {
      throw new ForbiddenException('Not allowed');
    }

    return plan;
  }

  @Post('plan')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createPlan(
    @Request() req: AuthType,
    @Body() body: PlanCreateRequestDto,
  ) {
    const plan = await this.planChangeService.createPlan({
      ...body,
      companyId: req.user.companyId,
    });

    return plan;
  }
}
