import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AgencyInfoComponent } from './agency-info.component';

describe('AgencyInfoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyInfoComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('identifies the page as an institutional evaluation', () => {
    const fixture = TestBed.createComponent(AgencyInfoComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Canal digital en evaluación');
    expect(content).toContain('sin constancia turística ni distintivo oficial');
    expect(content).toContain('Exclusivamente digital');
    expect(content).toContain('Anexo II');
    expect(content).toContain('Minorista y operador de turismo');
    expect(content).toContain('Tours propios y tours de terceros');
  });

  it('shows the documented legal identity and keeps the tourist registration pending', () => {
    const fixture = TestBed.createComponent(AgencyInfoComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Razón social o titular');
    expect(content).toContain("KUSI Q'UMIR AGENCIA DE VIAJES Y TURISMO E.I.R.L.");
    expect(content).toContain('20615150984');
    expect(content).toContain('Baja provisional por oficio');
    expect(content).toContain('908 990 666');
    expect(content).toContain('Horario de oficina');
    expect(content).toContain('Sin constancia acreditada');
  });
});
