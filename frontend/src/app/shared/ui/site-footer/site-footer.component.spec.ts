import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SiteFooterComponent } from './site-footer.component';

describe('SiteFooterComponent', () => {
  it('exposes verified contact channels and the commercial status', async () => {
    await TestBed.configureTestingModule({
      imports: [SiteFooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(SiteFooterComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('a[href="tel:+51908990666"]')).toBeTruthy();
    expect(element.querySelector('a[href="mailto:kusiqumir@gmail.com"]')).toBeTruthy();
    expect(element.textContent).toContain('Canal exclusivamente digital · sin ventas');
  });
});
