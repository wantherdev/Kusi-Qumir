import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { PageHeaderComponent } from './page-header.component';

async function setup() {
  await TestBed.configureTestingModule({
    imports: [PageHeaderComponent],
    providers: [provideRouter([{ path: '', component: PageHeaderComponent }])],
  }).compileComponents();
  const fixture = TestBed.createComponent(PageHeaderComponent);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const dialog = element.querySelector('dialog') as HTMLDialogElement;
  // jsdom does not implement the browser's modal dialog lifecycle.
  dialog.showModal = () => dialog.setAttribute('open', '');
  dialog.close = () => dialog.removeAttribute('open');
  const toggle = element.querySelector('.menu-toggle') as HTMLButtonElement;
  return { fixture, element, dialog, toggle };
}

describe('PageHeaderComponent', () => {
  it('preserves desktop navigation and provides four named mobile destinations', async () => {
    const { element } = await setup();
    const desktop = element.querySelectorAll('.site-navigation a');
    expect(desktop).toHaveLength(5);
    expect(desktop[0].getAttribute('href')).toBe('/tours');
    expect(desktop[3].getAttribute('href')).toBe('/informacion-institucional');
    expect(element.querySelector('.header-brand')?.getAttribute('aria-label')).toContain(
      'Ir al inicio',
    );
    expect(
      Array.from(element.querySelectorAll('.mobile-dock > a, .mobile-dock > button')).map((item) =>
        item.textContent?.trim(),
      ),
    ).toEqual(['Inicio', 'Tours', 'Contacto', 'Menú']);
  });

  it('opens a labelled modal and restores focus and scrolling when cancelled', async () => {
    const { fixture, dialog, toggle } = await setup();
    toggle.click();
    fixture.detectChanges();
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-labelledby')).toBe('mobile-menu-title');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.classList.contains('menu-open')).toBe(true);

    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('menu-open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('closes on backdrop click without closing when the sheet content is clicked', async () => {
    const { fixture, element, dialog, toggle } = await setup();
    toggle.click();
    element
      .querySelector('.mobile-menu__intro')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dialog.open).toBe(true);
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
    expect(document.body.classList.contains('menu-open')).toBe(false);
  });

  it('marks Contacto as current without marking Inicio at the contact fragment', async () => {
    const { fixture, element } = await setup();
    await TestBed.inject(Router).navigateByUrl('/#contacto');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const links = element.querySelectorAll('.mobile-dock a');
    expect(links[0].hasAttribute('aria-current')).toBe(false);
    expect(links[2].getAttribute('aria-current')).toBe('location');
  });

  it('restores scrolling when destroyed while open', async () => {
    const { fixture, toggle } = await setup();
    toggle.click();
    fixture.destroy();
    expect(document.body.classList.contains('menu-open')).toBe(false);
  });

  it('closes the sheet when switching to the desktop layout', async () => {
    const { fixture, dialog, toggle } = await setup();
    toggle.click();
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
    expect(document.body.classList.contains('menu-open')).toBe(false);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
  });
});
