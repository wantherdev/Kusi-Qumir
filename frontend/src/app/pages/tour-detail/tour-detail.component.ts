import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  Subject,
  switchMap,
  take,
  timeout,
} from 'rxjs';

import { responsiveTourPhoto } from '../../../destination-photos';
import { agencyProfile } from '../../config/agency-profile';
import { tourSocialImage } from '../../core/seo/seo-title.strategy';
import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { Tour, TourSummary } from '../../features/tours/domain/tour.model';
import {
  formatTourPrice,
  tourCategory,
  tourDifficulty,
  tourDuration,
  tourImage,
  tourImageAlt,
  tourOperation,
  tourStartingPrice,
} from '../../features/tours/domain/tour-view';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

const tourSearchTitles: Readonly<Record<string, string>> = {
  'city-tour-cusco': 'City Tour Cusco: Coricancha y Sacsayhuamán',
  'valle-sagrado': 'Tour Valle Sagrado desde Cusco | Valle VIP',
  'maras-moray': 'Tour Maras y Moray desde Cusco',
  'machu-picchu-full-day': 'Tour Machu Picchu desde Cusco en un día',
  'laguna-humantay': 'Tour Laguna Humantay desde Cusco',
  'montana-colores': 'Tour Montaña de 7 Colores (Vinicunca) desde Cusco',
  'valle-sur': 'Tour Valle Sur del Cusco: Tipón y Andahuaylillas',
  waqrapukara: 'Tour Waqrapukara desde Cusco',
  'puente-qeswachaka': 'Tour al puente inca Q’eswachaka desde Cusco',
  palcoyo: 'Tour Montaña de Colores de Palcoyo desde Cusco',
};

function tourSearchTitle(tour: Tour): string {
  const custom = tour.seo?.title?.trim();
  const previousDefault = custom?.replace(/\s*\|\s*Kusi Q[’']umir$/i, '');
  if (custom && previousDefault !== tour.title) return custom;

  const label = Object.hasOwn(tourSearchTitles, tour.slug)
    ? tourSearchTitles[tour.slug]
    : tour.title;
  return `${label} | Kusi Q’umir`;
}

const relatedTourSlugs: Readonly<Partial<Record<string, readonly string[]>>> = {
  'city-tour-cusco': ['valle-sagrado', 'valle-sur'],
  'valle-sagrado': ['maras-moray', 'machu-picchu-full-day'],
  'maras-moray': ['valle-sagrado', 'valle-sur'],
  'machu-picchu-full-day': ['valle-sagrado', 'city-tour-cusco'],
  'laguna-humantay': ['montana-colores', 'palcoyo'],
  'montana-colores': ['palcoyo', 'laguna-humantay'],
  'valle-sur': ['city-tour-cusco', 'maras-moray'],
  waqrapukara: ['puente-qeswachaka', 'laguna-humantay'],
  'puente-qeswachaka': ['waqrapukara', 'valle-sur'],
  palcoyo: ['montana-colores', 'laguna-humantay'],
};

function findRelatedTours(tour: Tour, catalog: TourSummary[]): TourSummary[] {
  const candidates = catalog.filter(({ slug }) => slug !== tour.slug);
  const related = Object.hasOwn(relatedTourSlugs, tour.slug)
    ? (relatedTourSlugs[tour.slug] ?? [])
    : [];
  const matches = related.flatMap((slug) => candidates.filter((item) => item.slug === slug));
  return [
    ...matches,
    ...candidates.filter(
      (item) => item.categorySlug === tour.categorySlug && !related.includes(item.slug),
    ),
  ].slice(0, 3);
}

const priorityCopy: Readonly<
  Partial<
    Record<
      string,
      {
        description: string;
        legacySnippet: string;
        legacyDescriptionStart: string;
        snippet: string;
      }
    >
  >
> = {
  'laguna-humantay': {
    legacyDescriptionStart:
      'Una experiencia de senderismo que te lleva a una de las lagunas más hermosas del Perú',
    description:
      'El tour sale de Cusco y pasa por Mollepata antes de iniciar la caminata en Soraypampa. La subida es de dificultad moderada y el recorrido incluye transporte, guía, desayuno y almuerzo. La entrada a la laguna y el alquiler opcional de caballo se pagan aparte.',
    legacySnippet:
      'Consulta el recorrido a la Laguna Humantay. Camina hasta la laguna turquesa de los Andes con guía profesional.',
    snippet:
      'Tour Laguna Humantay desde Cusco: consulta el itinerario por Mollepata y Soraypampa, la dificultad de la subida y qué incluye el precio referencial.',
  },
  'montana-colores': {
    legacyDescriptionStart:
      'La Montaña Vinicunca, también conocida como la Montaña Arcoíris, es el segundo destino más visitado',
    description:
      'Excursión de un día desde Cusco a la Montaña de 7 Colores, también llamada Vinicunca. La ruta pasa por Pitumarca y continúa a pie hasta el mirador. Es una caminata exigente por la altitud. El recorrido incluye transporte, guía, desayuno y almuerzo; la entrada y el caballo opcional se pagan aparte.',
    legacySnippet:
      'Consulta el recorrido a la Montaña de 7 Colores Vinicunca. Caminata inolvidable a 5,200 msnm con guía profesional.',
    snippet:
      'Tour a Vinicunca desde Cusco por Pitumarca. Revisa la dificultad de la caminata, el itinerario, las comidas incluidas y los gastos que se pagan aparte.',
  },
};

type TourState =
  | { status: 'loading' }
  | { status: 'loaded'; tour: Tour }
  | { status: 'not-found' }
  | { status: 'error' };

@Component({
  selector: 'app-tour-detail',
  imports: [PageHeaderComponent, RouterLink, SiteFooterComponent],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ToursApiService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly retryTour = new Subject<void>();

  protected readonly profile = agencyProfile;
  protected readonly state = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      distinctUntilChanged(),
      switchMap((slug) =>
        this.retryTour.pipe(
          startWith(undefined),
          switchMap(() =>
            this.api.findOne(slug).pipe(
              map((tour): TourState => {
                const copy = Object.hasOwn(priorityCopy, tour.slug)
                  ? priorityCopy[tour.slug]
                  : undefined;
                if (!copy || tour.seo?.description !== copy.legacySnippet)
                  return { status: 'loaded', tour };
                const faqs =
                  tour.slug === 'montana-colores'
                    ? tour.faqs.map((faq) =>
                        faq.answer.includes('5,200 msnm')
                          ? {
                              ...faq,
                              answer:
                                'Es una caminata exigente por la altitud. Revisa el horario orientativo de subida en el itinerario.',
                            }
                          : faq,
                      )
                    : tour.faqs;
                return {
                  status: 'loaded',
                  tour: {
                    ...tour,
                    description: tour.description.startsWith(copy.legacyDescriptionStart)
                      ? copy.description
                      : tour.description,
                    faqs,
                    seo: { ...tour.seo, description: copy.snippet },
                  },
                };
              }),
              catchError((error: unknown) =>
                of<TourState>({ status: this.isNotFound(error) ? 'not-found' : 'error' }),
              ),
              startWith<TourState>({ status: 'loading' }),
            ),
          ),
        ),
      ),
    ),
    { requireSync: true },
  );
  protected readonly tour = computed(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.tour : null;
  });
  private readonly relatedCatalog = toSignal(
    toObservable(this.tour).pipe(
      filter((tour): tour is Tour => tour !== null),
      take(1),
      switchMap(() =>
        this.api.findAll().pipe(
          timeout(6000),
          catchError(() => of([])),
        ),
      ),
    ),
    { initialValue: [] },
  );
  protected readonly relatedTours = computed(() => {
    const tour = this.tour();
    return tour ? findRelatedTours(tour, this.relatedCatalog()) : [];
  });
  protected readonly photo = computed(() => {
    const tour = this.tour();
    return tour ? responsiveTourPhoto(tourImage(tour)) : null;
  });
  protected readonly comparisonTour = computed(() => {
    if (this.tour()?.slug !== 'palcoyo') return null;
    return this.relatedTours().find(({ slug }) => slug === 'montana-colores') ?? null;
  });
  protected readonly imageFor = tourImage;
  protected readonly imageAltFor = tourImageAlt;
  protected readonly categoryFor = tourCategory;
  protected readonly durationFor = tourDuration;
  protected readonly difficultyFor = tourDifficulty;
  protected readonly operationFor = tourOperation;
  protected readonly priceFor = formatTourPrice;
  protected readonly startingPrice = computed(() => {
    const tour = this.tour();
    return tour ? tourStartingPrice(tour) : null;
  });
  protected readonly whatsappHref = computed(() => {
    const tour = this.tour();
    if (!tour) return this.profile.whatsappHref;

    const message = `Hola, quisiera información sobre el tour “${tour.title}” (${tour.code}).`;
    return `${this.profile.whatsappHref}?text=${encodeURIComponent(message)}`;
  });

  constructor() {
    effect(() => {
      const tour = this.tour();
      if (!tour) return;

      const title = tourSearchTitle(tour);
      const description = tour.seo?.description?.trim() || tour.shortDescription;
      const image = tourSocialImage(tourImage(tour));
      this.title.setTitle(title);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ name: 'twitter:description', content: description });
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    });
  }

  protected retry(): void {
    this.retryTour.next();
  }

  private isNotFound(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as { status: unknown }).status === 404
    );
  }
}
