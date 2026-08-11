import { NotFoundException } from '@nestjs/common';

import { ToursService } from '../src/modules/tours/tours.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ToursService', () => {
  it('returns only active tours using the public projection', async () => {
    const findMany = jest.fn().mockResolvedValue([{ slug: 'city-tour-cusco' }]);
    const service = new ToursService({ tour: { findMany } } as unknown as PrismaService);

    await expect(service.findAll()).resolves.toEqual([{ slug: 'city-tour-cusco' }]);
    expect(findMany).toHaveBeenCalledTimes(1);
  });

  it('does not expose missing or inactive tours', async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    const service = new ToursService({ tour: { findFirst } } as unknown as PrismaService);

    await expect(service.findOne('inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });
});
