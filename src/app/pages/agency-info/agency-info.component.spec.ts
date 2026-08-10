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
    expect(content).toContain('Canal digital en evaluación institucional');
    expect(content).toContain('Sin distintivo oficial');
    expect(content).toContain('Exclusivamente digital');
    expect(content).toContain('Anexo II');
    expect(content).toContain('Minorista y operador de turismo');
    expect(content).toContain('Tours propios y tours de terceros');
  });

  it('does not invent the legal identity or registration', () => {
    const fixture = TestBed.createComponent(AgencyInfoComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Razón social o titular');
    expect(content).toContain('Pendiente de sustento');
    expect(content).toContain('Sin constancia acreditada');
  });
});
