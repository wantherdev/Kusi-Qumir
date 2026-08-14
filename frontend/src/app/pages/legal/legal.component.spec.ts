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
    expect(fixture.nativeElement.textContent).toContain('Exclusivamente digital');
    expect(fixture.nativeElement.textContent).toContain('prestados por terceros');
    expect(fixture.nativeElement.textContent).toContain('20615150984');
    expect(fixture.nativeElement.textContent).toContain('El RUC está activo');
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
    expect(fixture.nativeElement.textContent).toContain('D.S. N.° 016-2024-JUS');
  });
});
