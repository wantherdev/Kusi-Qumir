import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { ToursComponent } from './tours.component';

const tour: TourSummary = {
  slug: 'city-tour-cusco',
  code: 'CTC-001',
  title: 'City Tour Cusco',
  subtitle: 'Descubre Cusco',
  shortDescription: 'Recorre los principales atractivos de Cusco.',
  durationHours: 5,
  durationDays: 1,
  difficulty: 'Easy',
  groupType: 'Shared',
  serviceType: 'HalfDay',
  featured: true,
  categorySlug: 'cultural',
  prices: [{ name: 'General', currency: 'USD', adult: 35, child: 25 }],
  images: [],
};

describe('ToursComponent', () => {
  it('renders tours returned by the own API without enabling sales', async () => {
    await TestBed.configureTestingModule({
      imports: [ToursComponent],
      providers: [
        provideRouter([]),
        { provide: ToursApiService, useValue: { findAll: () => of([tour]) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToursComponent);
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('City Tour Cusco');
    expect(content).toContain('USD 35');
    expect(content).toContain('reservas y pagos desactivados');
    expect(fixture.nativeElement.querySelector('a[href="/tours/city-tour-cusco"]')).toBeTruthy();
  });
});
