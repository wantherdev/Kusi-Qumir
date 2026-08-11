import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { LandingComponent } from './landing.component';

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

describe('LandingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideRouter([]),
        { provide: ToursApiService, useValue: { findAll: () => of([tour]) } },
      ],
    }).compileComponents();
  });

  it('renders the main value proposition', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement;
    expect(heading.textContent).toContain('Cusco auténtico');
    expect(fixture.nativeElement.textContent).toContain('Canal exclusivamente digital');
    expect(fixture.nativeElement.textContent).toContain('Anexo II');
    expect(fixture.nativeElement.textContent).toContain('Tours propios');
    expect(fixture.nativeElement.textContent).toContain('Tours de terceros');
    expect(fixture.nativeElement.textContent).toContain('City Tour Cusco');
    expect(fixture.nativeElement.textContent).toContain('USD 35');
  });

  it('offers the confirmed contact channels without collecting data', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('908 990 666');
    expect(content).toContain('kusiqumir@gmail.com');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="https://wa.me/51908990666"]')).toBeTruthy();
  });

  it('closes the mobile menu with Escape', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('menu-open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('restores body scrolling when the page is destroyed', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement).click();
    expect(document.body.classList.contains('menu-open')).toBe(true);

    fixture.destroy();

    expect(document.body.classList.contains('menu-open')).toBe(false);
  });
});
