import { TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { Tour } from '../../features/tours/domain/tour.model';
import { TourDetailComponent } from './tour-detail.component';

const tour: Tour = {
  slug: 'valle-sagrado',
  code: 'VSI-002',
  title: 'Valle Sagrado de los Incas',
  subtitle: 'Historia viva entre montañas',
  shortDescription: 'Una ruta cultural por el Valle Sagrado.',
  description: 'Conoce sitios arqueológicos, paisajes y comunidades del valle.',
  durationHours: 10,
  durationDays: 1,
  difficulty: 'Facil',
  groupType: 'Compartido',
  serviceType: 'DiaCompleto',
  operationType: 'PROPIO',
  featured: true,
  categorySlug: 'historia',
  recommendedFor: ['Viajeros culturales'],
  prices: [{ name: 'Servicio compartido', currency: 'PEN', adult: 180, child: 140 }],
  itineraryDays: [
    {
      day: 1,
      title: 'Valle Sagrado',
      activities: [
        {
          sortOrder: 1,
          time: '08:00',
          title: 'Salida desde Cusco',
          description: 'Inicio del recorrido.',
          duration: 60,
        },
      ],
    },
  ],
  includes: [{ title: 'Guía profesional' }],
  excludes: [{ title: 'Boleto turístico' }],
  faqs: [{ question: '¿Qué llevar?', answer: 'Protección solar.', sortOrder: 1 }],
  recommendations: [{ title: 'Ropa', description: 'Lleva capas ligeras.' }],
  requirements: [{ requirement: 'Documento de identidad' }],
  images: [
    {
      url: '/assets/images/tours/valle-sagrado.webp',
      alt: 'Terrazas del Valle Sagrado bajo la luz de la mañana',
      featured: true,
      sortOrder: 1,
    },
  ],
  seo: {
    title: 'Tour Valle Sagrado | Kusi Q’umir',
    description: 'Conoce el Valle Sagrado con una ruta explicada.',
    keywords: ['Valle Sagrado'],
  },
  destinations: [{ key: 'pisac', sortOrder: 1 }],
};

async function configure(api: { findOne: ReturnType<typeof vi.fn> }) {
  await TestBed.configureTestingModule({
    imports: [TourDetailComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ slug: tour.slug })) },
      },
      { provide: ToursApiService, useValue: api },
    ],
  }).compileComponents();
}

describe('TourDetailComponent', () => {
  it('renders catalog content, metadata and a contextual WhatsApp link', async () => {
    await configure({ findOne: vi.fn().mockReturnValue(of(tour)) });

    const fixture = TestBed.createComponent(TourDetailComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const image = element.querySelector('.tour-hero > img') as HTMLImageElement;
    const whatsapp = element.querySelector('.tour-actions .kq-button') as HTMLAnchorElement;
    const primaryInquiry = element.querySelector('.hero-inquiry .kq-button') as HTMLAnchorElement;

    expect(element.querySelector('h1')?.textContent).toContain(tour.title);
    expect(element.querySelector('.tour-hero .kq-eyebrow')?.textContent).toContain('Historia');
    expect(image.alt).toBe(tour.images[0].alt);
    expect(new URL(whatsapp.href).searchParams.get('text')).toContain(tour.title);
    expect(new URL(primaryInquiry.href).searchParams.get('text')).toContain(tour.title);
    expect(element.querySelector('.hero-inquiry')?.textContent).toContain('S/ 180');
    expect(element.querySelector('.service-origin')?.textContent).toContain('experiencia propia');
    expect(element.querySelector('.breadcrumbs [aria-current="page"]')?.textContent).toContain(
      tour.title,
    );
    expect(document.title).toBe(tour.seo?.title);
    expect(document.head.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(
      tour.seo?.title,
    );
  });

  it('lets the user retry when the API temporarily fails', async () => {
    const findOne = vi
      .fn()
      .mockReturnValueOnce(throwError(() => new Error('offline')))
      .mockReturnValueOnce(of(tour));
    await configure({ findOne });

    const fixture = TestBed.createComponent(TourDetailComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();

    (fixture.nativeElement.querySelector('.state-card button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(findOne).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(tour.title);
  });

  it('distinguishes a missing tour from a connection failure', async () => {
    await configure({ findOne: vi.fn().mockReturnValue(throwError(() => ({ status: 404 }))) });

    const fixture = TestBed.createComponent(TourDetailComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Esta ruta no está disponible');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
