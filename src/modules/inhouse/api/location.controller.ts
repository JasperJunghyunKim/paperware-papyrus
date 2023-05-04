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
import { LocationCreateRequest } from 'src/@shared/api/location/location.request';
import { LocationChangeService } from 'src/modules/inhouse/service/location-change.service';
import { LocationRetriveService } from 'src/modules/inhouse/service/location-retrive.service';
import {
  LocationListQueryDto,
  LocationUpdateRequestDto,
} from '../dto/location.request';
import { AuthType } from 'src/modules/auth/auth.type';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('inhouse/location')
export class LocationController {
  constructor(
    private readonly locationRetriveService: LocationRetriveService,
    private readonly locationChangeService: LocationChangeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getList(@Query() query: LocationListQueryDto): Promise<Array<any>> {
    return await this.locationRetriveService.getList(
      Number(query.skip),
      Number(query.take),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  async get(@Param('id') id: number) {
    return await this.locationRetriveService.getItem(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async create(@Request() req: AuthType, @Body() body: LocationCreateRequest) {
    await this.locationChangeService.create({
      name: body.name,
      code: body.code,
      isPublic: body.isPublic,
      address: body.address,
      company: {
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
    @Body() body: LocationUpdateRequestDto,
  ) {
    const location = await this.locationRetriveService.getItem(id);

    if (location.companyId !== req.user.companyId) {
      throw new ForbiddenException();
    }

    await this.locationChangeService.update(id, {
      name: body.name,
      code: body.code,
      isPublic: body.isPublic,
      address: body.address,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async delete(@Request() req: AuthType, @Param('id') id: number) {
    const location = await this.locationRetriveService.getItem(id);

    if (location.companyId !== req.user.companyId) {
      throw new ForbiddenException();
    }

    await this.locationChangeService.delete(id);
  }
}
