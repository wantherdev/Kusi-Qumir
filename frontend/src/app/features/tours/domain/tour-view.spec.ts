import { TourSummary } from './tour.model';
import { formatTourPrice, tourCategory, tourImageAlt, tourOperation } from './tour-view';

const tour: TourSummary = {
  slug: 'valle-sagrado',
  code: 'VSI-002',
  title: 'Valle Sagrado de los Incas',
  subtitle: null,
  shortDescription: 'Una ruta cultural.',
  durationHours: 10,
  durationDays: 1,
  difficulty: 'Facil',
  groupType: 'Compartido',
  serviceType: 'DiaCompleto',
  operationType: 'PROPIO',
  featured: true,
  categorySlug: 'historia',
  prices: [],
  images: [
    {
      url: '/assets/images/tours/valle-sagrado.webp',
      alt: 'Terrazas del Valle Sagrado bajo la luz de la mañana',
      featured: true,
      sortOrder: 1,
    },
  ],
};

describe('formatTourPrice', () => {
  it('uses the Peruvian sol symbol for PEN amounts', () => {
    expect(formatTourPrice(119, 'PEN')).toBe('S/ 119');
  });

  it('keeps an unknown currency code visible', () => {
    expect(formatTourPrice(35, 'USD')).toBe('USD 35');
  });
});

describe('tour presentation helpers', () => {
  it('uses the catalog alt text and a readable category label', () => {
    expect(tourImageAlt(tour)).toBe('Terrazas del Valle Sagrado bajo la luz de la mañana');
    expect(tourCategory(tour)).toBe('Historia');
    expect(tourOperation(tour)).toBe('Tour propio');
  });
});
