import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

import { agencyProfile } from '../../config/agency-profile';
import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { TourCardSkeletonComponent } from '../../features/tours/ui/tour-card-skeleton/tour-card-skeleton.component';
import { TourCardComponent } from '../../features/tours/ui/tour-card/tour-card.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

type CatalogState =
  { status: 'loading' } | { status: 'loaded'; tours: TourSummary[] } | { status: 'error' };

const HOME_TOUR_LIMIT = 4;
const NAV_DESKTOP_BREAKPOINT = 1100;
const CATALOG_FALLBACK_TOTAL = 10;
const CATALOG_FALLBACK_OWN = 4;
const CATALOG_FALLBACK_THIRD = 6;

@Component({
  selector: 'app-landing',
  imports: [RouterLink, SiteFooterComponent, TourCardComponent, TourCardSkeletonComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toursApi = inject(ToursApiService);
  private readonly catalogReload = new Subject<void>();
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');

  protected readonly agencyProfile = agencyProfile;
  protected readonly loadingCards = [1, 2, 3, 4];
  protected readonly menuOpen = signal(false);
  protected readonly headerScrolled = signal(false);
  protected readonly catalogState = toSignal(
    isPlatformBrowser(this.platformId)
      ? this.catalogReload.pipe(
          startWith(undefined),
          switchMap(() =>
            this.toursApi.findAll().pipe(
              map((tours): CatalogState => ({ status: 'loaded', tours })),
              catchError(() => of<CatalogState>({ status: 'error' })),
              startWith<CatalogState>({ status: 'loading' }),
            ),
          ),
        )
      : of<CatalogState>({ status: 'loading' }),
    { requireSync: true },
  );
  protected readonly tours = computed(() => {
    const state = this.catalogState();
    if (state.status !== 'loaded') return [];

    const ownTours = state.tours.filter((tour) => tour.operationType === 'PROPIO');
    const remainingTours = state.tours.filter((tour) => tour.operationType !== 'PROPIO');
    return [...ownTours, ...remainingTours].slice(0, HOME_TOUR_LIMIT);
  });
  protected readonly catalogLoading = computed(() => this.catalogState().status === 'loading');
  protected readonly catalogError = computed(() => this.catalogState().status === 'error');
  protected readonly tourTotal = computed(() => {
    const state = this.catalogState();
    return state.status === 'loaded' ? state.tours.length : CATALOG_FALLBACK_TOTAL;
  });
  protected readonly ownToursCount = computed(() => {
    const state = this.catalogState();
    return state.status === 'loaded'
      ? state.tours.filter((tour) => tour.operationType === 'PROPIO').length
      : CATALOG_FALLBACK_OWN;
  });
  protected readonly thirdToursCount = computed(() => {
    const state = this.catalogState();
    return state.status === 'loaded'
      ? state.tours.filter((tour) => tour.operationType !== 'PROPIO').length
      : CATALOG_FALLBACK_THIRD;
  });

  constructor() {
    afterNextRender(() => this.onWindowScroll());
    this.destroyRef.onDestroy(() => this.document.body.classList.remove('menu-open'));
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.headerScrolled.set(window.scrollY > 20);
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (window.innerWidth > NAV_DESKTOP_BREAKPOINT && this.menuOpen()) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      this.menuToggle()?.nativeElement.focus();
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.document.body.classList.toggle('menu-open', this.menuOpen());
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.document.body.classList.remove('menu-open');
  }

  protected retryCatalog(): void {
    this.catalogReload.next();
  }
}
