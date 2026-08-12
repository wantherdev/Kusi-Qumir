import { Controller, Get, Header, Param, Query } from '@nestjs/common';

import { TourSlugParamDto } from './dto/tour-slug-param.dto';
import { ToursQueryDto } from './dto/tours-query.dto';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly tours: ToursService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  findAll(@Query() params: ToursQueryDto) {
    return this.tours.findAll(params);
  }

  @Get(':slug')
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  findOne(@Param() params: TourSlugParamDto) {
    return this.tours.findOne(params.slug);
  }
}
