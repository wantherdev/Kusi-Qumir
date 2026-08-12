import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { tourCategory, tourDifficulty } from '../../features/tours/domain/tour-view';
import { TourCardSkeletonComponent } from '../../features/tours/ui/tour-card-skeleton/tour-card-skeleton.component';
import { TourCardComponent } from '../../features/tours/ui/tour-card/tour-card.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

type ToursState =
  { status: 'loading' } | { status: 'loaded'; tours: TourSummary[] } | { status: 'error' };

const ALL_CATEGORIES = 'todas';

function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es-PE')
    .trim();
}

@Component({
  selector: 'app-tours',
  imports: [PageHeaderComponent, SiteFooterComponent, TourCardComponent, TourCardSkeletonComponent],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToursComponent {
  private readonly api = inject(ToursApiService);
  private readonly reload = new Subject<void>();

  protected readonly loadingCards = [1, 2, 3, 4, 5, 6];
  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal(ALL_CATEGORIES);
  protected readonly state = toSignal(
    this.reload.pipe(
      startWith(undefined),
      switchMap(() =>
        this.api.findAll().pipe(
          map((tours): ToursState => ({ status: 'loaded', tours })),
          catchError(() => of<ToursState>({ status: 'error' })),
          startWith<ToursState>({ status: 'loading' }),
        ),
      ),
    ),
    { requireSync: true },
  );
  protected readonly tours = computed(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.tours : [];
  });
  protected readonly hasError = computed(() => this.state().status === 'error');
  protected readonly isLoading = computed(() => this.state().status === 'loading');
  protected readonly categories = computed(() => {
    const categories = new Map<string, string>();
    this.tours().forEach((tour) => categories.set(tour.categorySlug, tourCategory(tour)));
    return [...categories].map(([value, label]) => ({ value, label }));
  });
  protected readonly filteredTours = computed(() => {
    const query = normalizeSearch(this.searchQuery());
    const selectedCategory = this.selectedCategory();

    return this.tours().filter((tour) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES || tour.categorySlug === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      const searchableContent = normalizeSearch(
        `${tour.title} ${tour.shortDescription} ${tourCategory(tour)} ${tourDifficulty(tour)}`,
      );
      return searchableContent.includes(query);
    });
  });
  protected readonly hasActiveFilters = computed(
    () => this.searchQuery().trim().length > 0 || this.selectedCategory() !== ALL_CATEGORIES,
  );

  protected updateSearch(event: Event): void {
    if (event.currentTarget instanceof HTMLInputElement) {
      this.searchQuery.set(event.currentTarget.value);
    }
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(ALL_CATEGORIES);
  }

  protected retry(): void {
    this.reload.next();
  }
}
