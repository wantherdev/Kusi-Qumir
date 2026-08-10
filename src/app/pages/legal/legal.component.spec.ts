import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { LegalComponent } from './legal.component';

describe('LegalComponent', () => {
  it('renders the requested legal draft', async () => {
    await TestBed.configureTestingModule({
      imports: [LegalComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { document: 'terms' } } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LegalComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Términos y condiciones',
    );
    expect(fixture.nativeElement.textContent).toContain('borrador no vigente');
    expect(fixture.nativeElement.textContent).toContain('operación exclusivamente digital');
    expect(fixture.nativeElement.textContent).toContain('prestados por terceros');
  });

  it('falls back safely when route data is invalid', async () => {
    await TestBed.configureTestingModule({
      imports: [LegalComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { document: 'unknown' } } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LegalComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Política de privacidad',
    );
  });
});
