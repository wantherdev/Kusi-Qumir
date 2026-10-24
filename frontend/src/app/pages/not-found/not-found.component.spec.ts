import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  it('offers a clear way back to the landing', async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('no forma parte del recorrido');
    expect(element.querySelector('main a.kq-button')?.textContent).toContain('Volver al inicio');
  });

  it('shows a decorative mascot figure', async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const mascot = element.querySelector('.not-found-mascot img') as HTMLImageElement;
    expect(mascot).toBeTruthy();
    expect(mascot.getAttribute('loading')).toBe('lazy');
    expect(mascot.getAttribute('alt')).toBe('');
    expect(mascot.getAttribute('src')).toBe('/assets/phuyu/static/phuyu-official.webp');
  });
});
