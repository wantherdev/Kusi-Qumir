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
});
