import { TestBed } from '@angular/core/testing';

import { TourCardSkeletonComponent } from './tour-card-skeleton.component';

describe('TourCardSkeletonComponent', () => {
  it('renders a decorative skeleton without interactive content', async () => {
    await TestBed.configureTestingModule({
      imports: [TourCardSkeletonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TourCardSkeletonComponent);
    fixture.detectChanges();

    const article = fixture.nativeElement.querySelector('article') as HTMLElement;
    expect(article.getAttribute('aria-hidden')).toBe('true');
    expect(article.querySelectorAll('a, button, img')).toHaveLength(0);
  });
});
