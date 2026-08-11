import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

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
  featured: true,
  categorySlug: true,
  prices: true,
  images: true,
} as const;

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tour.findMany({
      where: { active: true },
      select: publicTourSummarySelect,
      orderBy: [{ featured: 'desc' }, { title: 'asc' }],
    });
  }

  async findOne(slug: string) {
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
