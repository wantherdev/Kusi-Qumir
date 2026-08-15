import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  it('provides consistent primary navigation and a named home link', async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;

    expect(links).toHaveLength(6);
    expect(links[0].getAttribute('aria-label')).toContain('Ir al inicio');
    expect(links[1].getAttribute('href')).toBe('/tours');
    expect(links[4].getAttribute('href')).toBe('/informacion-institucional');
    expect(links[5].textContent).toContain('Canales de atención');
  });

  it('closes the mobile navigation with Escape and restores focus', async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.classList.contains('menu-open')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('menu-open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('restores body scrolling when it is destroyed with the menu open', async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement).click();

    fixture.destroy();

    expect(document.body.classList.contains('menu-open')).toBe(false);
  });
});
