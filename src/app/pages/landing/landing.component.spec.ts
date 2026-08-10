import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the main value proposition', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement;
    expect(heading.textContent).toContain('Cusco auténtico');
    expect(fixture.nativeElement.textContent).toContain('Canal exclusivamente digital');
    expect(fixture.nativeElement.textContent).toContain('Anexo II');
    expect(fixture.nativeElement.textContent).toContain('Tours propios');
    expect(fixture.nativeElement.textContent).toContain('Tours de terceros');
  });

  it('validates the contact fields before preparing a consultation', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('.form-status') as HTMLParagraphElement;
    expect(status.textContent).toContain('Revisa los campos marcados');
    expect(status.getAttribute('role')).toBe('alert');
    expect(fixture.nativeElement.querySelector('#contact-name').getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('closes the mobile menu with Escape', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('menu-open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('restores body scrolling when the page is destroyed', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement).click();
    expect(document.body.classList.contains('menu-open')).toBe(true);

    fixture.destroy();

    expect(document.body.classList.contains('menu-open')).toBe(false);
  });
});
