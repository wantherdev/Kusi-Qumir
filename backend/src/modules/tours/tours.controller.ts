import { Controller, Get, Header, Param } from '@nestjs/common';

import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly tours: ToursService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  findAll() {
    return this.tours.findAll();
  }

  @Get(':slug')
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  findOne(@Param('slug') slug: string) {
    return this.tours.findOne(slug);
  }
}
