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
import { catchError, map, of, startWith } from 'rxjs';

import { agencyProfile } from '../../config/agency-profile';
import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { TourCardComponent } from '../../features/tours/ui/tour-card/tour-card.component';

type CatalogState =
  { status: 'loading' } | { status: 'loaded'; tours: TourSummary[] } | { status: 'error' };

@Component({
  selector: 'app-landing',
  imports: [RouterLink, TourCardComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toursApi = inject(ToursApiService);
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');

  protected readonly currentYear = new Date().getFullYear();
  protected readonly agencyProfile = agencyProfile;
  protected readonly menuOpen = signal(false);
  protected readonly headerScrolled = signal(false);
  protected readonly catalogState = toSignal(
    (isPlatformBrowser(this.platformId)
      ? this.toursApi.findAll().pipe(
          map((tours): CatalogState => ({ status: 'loaded', tours })),
          catchError(() => of<CatalogState>({ status: 'error' })),
        )
      : of<CatalogState>({ status: 'loading' })
    ).pipe(startWith<CatalogState>({ status: 'loading' })),
    { requireSync: true },
  );
  protected readonly tours = computed(() => {
    const state = this.catalogState();
    return state.status === 'loaded' ? state.tours : [];
  });
  protected readonly catalogLoading = computed(() => this.catalogState().status === 'loading');
  protected readonly catalogError = computed(() => this.catalogState().status === 'error');

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
    if (window.innerWidth > 900 && this.menuOpen()) {
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
}
