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

    expect(element.querySelector('h1')?.textContent).toContain('no está en el mapa');
    expect(element.querySelector('main a.kq-button')?.textContent).toContain('Volver al inicio');
  });

  it('shows approved Phuyu and offers catalog and contact recovery', async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-phuyu img')?.getAttribute('src')).toBe(
      '/assets/phuyu/static/phuyu-official.webp',
    );
    expect(element.querySelector('app-phuyu img')?.getAttribute('alt')).toContain('Phuyu');
    expect(element.querySelector('a[href="/tours"]')).toBeTruthy();
    expect(element.querySelector('a[href="/contacto"]')).toBeTruthy();
  });
});
