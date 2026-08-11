import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { TourCardComponent } from '../../features/tours/ui/tour-card/tour-card.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

type ToursState =
  { status: 'loading' } | { status: 'loaded'; tours: TourSummary[] } | { status: 'error' };

@Component({
  selector: 'app-tours',
  imports: [PageHeaderComponent, SiteFooterComponent, TourCardComponent],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToursComponent {
  private readonly api = inject(ToursApiService);
  private readonly reload = new Subject<void>();

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

  protected retry(): void {
    this.reload.next();
  }
}
