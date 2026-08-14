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
    expect(fixture.nativeElement.textContent).toContain('Servicios propios y de terceros');
    expect(fixture.nativeElement.textContent).toContain('20615150984');
    expect(fixture.nativeElement.textContent).toContain('El RUC está activo');
    expect(fixture.nativeElement.textContent).toContain('Exactitud de datos y emisión nominativa');
    expect(fixture.nativeElement.textContent).toContain('Cancelación por el proveedor');
    expect(fixture.nativeElement.textContent).toContain('Menores de edad en viajes');
    expect(fixture.nativeElement.textContent).toContain('Sin derecho de retracto');
  });

  it('renders the privacy draft with sensitive data and minors sections', async () => {
    await TestBed.configureTestingModule({
      imports: [LegalComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { document: 'privacy' } } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LegalComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Política de privacidad',
    );
    expect(fixture.nativeElement.textContent).toContain('Datos sensibles');
    expect(fixture.nativeElement.textContent).toContain('Ley N.° 29733');
    expect(fixture.nativeElement.textContent).toContain('consentimiento específico');
    expect(fixture.nativeElement.textContent).toContain('Datos de menores de edad');
  });

  it('renders the responsible tourism draft with ESNNA content', async () => {
    await TestBed.configureTestingModule({
      imports: [LegalComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { document: 'responsibleTourism' } } },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LegalComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Turismo responsable y protección de la niñez',
    );
    expect(fixture.nativeElement.textContent).toContain('artículo 179-A');
    expect(fixture.nativeElement.textContent).toContain('Línea 1818');
    expect(fixture.nativeElement.textContent).toContain('prevencionesnna@mincetur.gob.pe');
    expect(fixture.nativeElement.textContent).toContain('no equivale a una constancia');
  });

  it('renders the cancelaciones draft with the proposed policy', async () => {
    await TestBed.configureTestingModule({
      imports: [LegalComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { document: 'cancelaciones' } } },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LegalComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Política de cancelaciones y reembolsos',
    );
    expect(fixture.nativeElement.textContent).toContain('penalidad del 50%');
    expect(fixture.nativeElement.textContent).toContain('no endosables');
    expect(fixture.nativeElement.textContent).toContain('pendiente de aprobación');
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
