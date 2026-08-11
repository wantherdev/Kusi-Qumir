import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  it('provides a named home link and a visible catalog action', async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;

    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('aria-label')).toContain('Volver al inicio');
    expect(links[1].getAttribute('href')).toBe('/tours');
    expect(links[1].textContent).toContain('Explorar tours');
  });
});
