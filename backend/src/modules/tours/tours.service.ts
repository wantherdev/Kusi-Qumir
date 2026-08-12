import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { ToursQueryDto } from './dto/tours-query.dto';

const publicTourSelect = {
  slug: true,
  code: true,
  title: true,
  subtitle: true,
  shortDescription: true,
  description: true,
  durationHours: true,
  durationDays: true,
  difficulty: true,
  groupType: true,
  serviceType: true,
  operationType: true,
  featured: true,
  categorySlug: true,
  recommendedFor: true,
  prices: true,
  itineraryDays: true,
  includes: true,
  excludes: true,
  faqs: true,
  recommendations: true,
  requirements: true,
  images: true,
  seo: true,
  destinations: true,
} as const;

const publicTourSummarySelect = {
  slug: true,
  code: true,
  title: true,
  subtitle: true,
  shortDescription: true,
  durationHours: true,
  durationDays: true,
  difficulty: true,
  groupType: true,
  serviceType: true,
  operationType: true,
  featured: true,
  categorySlug: true,
  prices: true,
  images: true,
} as const;

export type TourSummary = Prisma.TourGetPayload<{
  select: typeof publicTourSummarySelect;
}>;

export type TourDetail = Prisma.TourGetPayload<{
  select: typeof publicTourSelect;
}>;

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: ToursQueryDto): Promise<TourSummary[]> {
    return this.prisma.tour.findMany({
      where: { active: true },
      select: publicTourSummarySelect,
      orderBy: [{ featured: 'desc' }, { title: 'asc' }],
      skip: params.offset ?? 0,
      take: params.limit ?? 10,
    });
  }

  async findOne(slug: string): Promise<TourDetail> {
    const tour = await this.prisma.tour.findFirst({
      where: { slug, active: true },
      select: publicTourSelect,
    });

    if (!tour) {
      throw new NotFoundException('Tour no encontrado.');
    }

    return tour;
  }
}
