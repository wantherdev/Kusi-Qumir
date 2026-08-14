import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ClaimsComponent } from './claims.component';

describe('ClaimsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows the required notice and the claims handling policy', () => {
    const fixture = TestBed.createComponent(ClaimsComponent);
    fixture.detectChanges();

    const notice = fixture.nativeElement.querySelector(
      '#claims-notice-title',
    ) as HTMLHeadingElement;
    expect(notice.textContent).toContain('Aviso del Libro de Reclamaciones');
    expect(fixture.nativeElement.textContent).toContain('Si tienes alguna queja o reclamo');

    const policy = fixture.nativeElement.querySelector(
      '#claims-policy-title',
    ) as HTMLHeadingElement;
    expect(policy.textContent).toContain('Política de atención de quejas y reclamos');
    expect(fixture.nativeElement.textContent).toContain('quince (15) días hábiles');
    expect(fixture.nativeElement.textContent).toContain('Indecopi');
  });

  it('shows field-level accessible errors for an incomplete form', () => {
    const fixture = TestBed.createComponent(ClaimsComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]') as HTMLParagraphElement;
    const name = fixture.nativeElement.querySelector(
      '[formcontrolname="nombre"]',
    ) as HTMLInputElement;
    expect(alert.textContent).toContain('Revisa los campos marcados');
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('#claim-name-error')?.textContent).toContain(
      'nombres y apellidos',
    );
    expect(document.activeElement).toBe(name);
  });

  it('requires a guardian when the consumer is a minor', () => {
    const fixture = TestBed.createComponent(ClaimsComponent);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector(
      '[formcontrolname="menorEdad"]',
    ) as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();

    const guardian = fixture.nativeElement.querySelector(
      '[formcontrolname="apoderado"]',
    ) as HTMLInputElement;
    expect(guardian).toBeTruthy();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(guardian.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('#claim-guardian-error')?.textContent).toContain(
      'representante',
    );
  });

  it('requires the travel date and the sworn statement before validating', () => {
    const fixture = TestBed.createComponent(ClaimsComponent);
    fixture.detectChanges();

    const travelDate = fixture.nativeElement.querySelector(
      '[formcontrolname="fechaViaje"]',
    ) as HTMLInputElement;
    expect(travelDate).toBeTruthy();

    const affidavit = fixture.nativeElement.querySelector(
      '[formcontrolname="declaracionJurada"]',
    ) as HTMLInputElement;
    expect(affidavit).toBeTruthy();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#claim-travel-date-error')?.textContent).toContain(
      'fecha del viaje',
    );
    expect(fixture.nativeElement.querySelector('#claim-affidavit-error')?.textContent).toContain(
      'declaración jurada',
    );
  });

  it('clears hidden guardian data when the consumer is no longer marked as a minor', () => {
    const fixture = TestBed.createComponent(ClaimsComponent);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector(
      '[formcontrolname="menorEdad"]',
    ) as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();

    const guardian = fixture.nativeElement.querySelector(
      '[formcontrolname="apoderado"]',
    ) as HTMLInputElement;
    guardian.value = 'Persona adulta responsable';
    guardian.dispatchEvent(new Event('input'));

    checkbox.click();
    fixture.detectChanges();
    checkbox.click();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('[formcontrolname="apoderado"]') as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
