import { describe, expect, it } from 'vitest';
import { buildTourDraft, safeImageUrl, slugFromTitle, TourDraft } from './tour-draft';

export const validDraft: TourDraft = {
  title: ' Laguna nueva ',
  slug: 'laguna-nueva',
  code: 'kq-011',
  subtitle: '',
  shortDescription: 'Una experiencia nueva.',
  description: 'Descripción de la experiencia.',
  durationHours: 10,
  difficulty: 'Moderada',
  groupType: 'Compartido',
  serviceType: 'DiaCompleto',
  operationType: 'PROPIO',
  categorySlug: 'naturaleza',
  featured: true,
  adult: 125.5,
  child: null,
  imageUrl: 'https://images.example.com/laguna.webp',
  imageAlt: 'Laguna entre montañas',
  includes: 'Guía\n\nTransporte',
  excludes: 'Almuerzo',
  requirements: 'Documento de identidad',
  recommendations: 'Llevar abrigo',
  itinerary: ['Recogida\nCaminata', 'Retorno'],
};

describe('tour draft', () => {
  it('maps the form into a complete draft without activating public visibility', () => {
    const tour = buildTourDraft(validDraft);
    expect(tour.active).toBe(false);
    expect(tour.title).toBe('Laguna nueva');
    expect(tour.code).toBe('KQ-011');
    expect(tour.durationDays).toBe(2);
    expect(tour.itineraryDays[0].activities.map((item) => item.title)).toEqual([
      'Recogida',
      'Caminata',
    ]);
    expect(tour.includes).toEqual([{ title: 'Guía' }, { title: 'Transporte' }]);
    expect(tour.prices).toEqual([{ name: 'Tarifa referencial', currency: 'PEN', adult: 125.5 }]);
  });
  it('preserves free child prices without coercing an empty price into zero', () => {
    expect(buildTourDraft({ ...validDraft, child: 0 }).prices[0].child).toBe(0);
    expect(buildTourDraft(validDraft).prices[0].child).toBeUndefined();
  });
  it('rejects invalid prices, empty days and malformed identifiers', () => {
    for (const patch of [
      { adult: NaN },
      { child: -1 },
      { itinerary: ['  '] },
      { slug: '../tour' },
      { durationHours: 2.5 },
    ]) {
      expect(() => buildTourDraft({ ...validDraft, ...patch })).toThrow();
    }
  });
  it('accepts HTTPS or local catalog images and rejects script, traversal and credential URLs', () => {
    expect(safeImageUrl('/assets/images/cusco.webp')).toBe(true);
    expect(safeImageUrl('https://images.example.com/image.jpg')).toBe(true);
    for (const url of [
      'javascript:alert(1)',
      '//example.com/a.jpg',
      '/assets/images/../x.png',
      'https://user:pass@example.com/a.jpg',
      'http://example.com/x.jpg',
    ])
      expect(safeImageUrl(url)).toBe(false);
  });
  it('generates predictable URL slugs from accented titles', () =>
    expect(slugFromTitle('  Montaña de 7 Colores! ')).toBe('montana-de-7-colores'));
});
