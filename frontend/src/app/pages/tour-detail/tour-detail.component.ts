import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, startWith, Subject, switchMap } from 'rxjs';

import { agencyProfile } from '../../config/agency-profile';
import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { Tour } from '../../features/tours/domain/tour.model';
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
              map((tour): TourState => ({ status: 'loaded', tour })),
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

      const title = tour.seo?.title ?? `${tour.title} | Kusi Q’umir`;
      const description = tour.seo?.description ?? tour.shortDescription;
      this.title.setTitle(title);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ name: 'twitter:description', content: description });
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
