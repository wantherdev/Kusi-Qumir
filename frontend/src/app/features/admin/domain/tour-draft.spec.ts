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
  itinerary: [
    {
      title: 'Llegada y caminata',
      activities: [
        {
          title: 'Recogida',
          time: '06:00',
          description: 'Te recogemos en el hotel.',
          duration: 30,
        },
        { title: 'Caminata', time: '08:00', description: 'Exploramos la laguna.', duration: 90 },
      ],
    },
    {
      title: 'Regreso a Cusco',
      activities: [{ title: 'Retorno', time: '', description: '', duration: 0 }],
    },
  ],
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
      { itinerary: [{ title: '  ', activities: [] }] },
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

import { buildTourUpdate, tourToDraft } from './tour-draft';
describe('editing existing tours', () => {
  it('patches a title without replacing rich itineraries, prices, images or FAQs', () => {
    const original = buildTourDraft(validDraft);
    original.itineraryDays[0].activities[0] = {
      ...original.itineraryDays[0].activities[0],
      time: '08:00',
      description: 'Detalle original',
      duration: 90,
    };
    original.prices.push({ name: 'Privado', currency: 'PEN', adult: 450, private: 450 });
    original.images.push({
      url: 'https://images.example.com/extra.webp',
      alt: 'Otra vista',
      featured: false,
      sortOrder: 1,
    });
    original.faqs.push({ question: '¿Qué llevar?', answer: 'Abrigo', sortOrder: 0 });
    const patch = buildTourUpdate(original, { ...tourToDraft(original), title: 'Nuevo título' });
    expect(patch).toEqual({ title: 'Nuevo título' });
  });
  it('updates the first tariff while retaining other tariffs and private pricing', () => {
    const original = buildTourDraft(validDraft);
    original.prices[0].private = 350;
    original.prices.push({ name: 'Otro servicio', currency: 'PEN', adult: 200 });
    const patch = buildTourUpdate(original, { ...tourToDraft(original), adult: 140, child: 0 });
    expect(patch.prices?.[0]).toMatchObject({ adult: 140, child: 0, private: 350 });
    expect(patch.prices?.[1]).toEqual(original.prices[1]);
    expect('active' in patch).toBe(false);
  });
  it('edits the same day title, time and description displayed by the public tour', () => {
    const original = buildTourDraft(validDraft);
    const draft = tourToDraft(original);
    draft.itinerary[0].title = 'Ruta por el Valle Sagrado';
    draft.itinerary[0].activities[1].title = 'Visita ampliada';
    draft.itinerary[0].activities[1].time = '09:00 – 10:00';
    draft.itinerary[0].activities[1].description = 'Nuevo detalle de la visita.';
    const patch = buildTourUpdate(original, draft);
    expect(patch.itineraryDays?.[0].title).toBe('Ruta por el Valle Sagrado');
    expect(patch.itineraryDays?.[0].activities[1]).toEqual({
      title: 'Visita ampliada',
      time: '09:00 – 10:00',
      description: 'Nuevo detalle de la visita.',
      duration: 90,
      sortOrder: 1,
    });
    expect(patch.itineraryDays?.[0].activities[0]).toEqual(original.itineraryDays[0].activities[0]);
    expect(original.itineraryDays[0].title).toBe('Llegada y caminata');
  });
  it('renumbers days and activities after deletion without mixing their descriptions', () => {
    const original = buildTourDraft(validDraft);
    const draft = tourToDraft(original);
    draft.itinerary[0].activities.splice(0, 1);
    const patch = buildTourUpdate(original, draft);
    expect(patch.itineraryDays?.[0].activities[0]).toMatchObject({
      title: 'Caminata',
      description: 'Exploramos la laguna.',
      time: '08:00',
      sortOrder: 0,
    });
    draft.itinerary.splice(0, 1);
    const shorter = buildTourUpdate(original, draft);
    expect(shorter.durationDays).toBe(1);
    expect(shorter.itineraryDays?.[0]).toMatchObject({ day: 1, title: 'Regreso a Cusco' });
  });
});
