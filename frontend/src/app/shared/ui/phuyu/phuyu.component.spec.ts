import { TestBed } from '@angular/core/testing';

import { PhuyuComponent } from './phuyu.component';

describe('PhuyuComponent', () => {
  it('renders a typed pose with reserved dimensions and lazy loading', async () => {
    await TestBed.configureTestingModule({ imports: [PhuyuComponent] }).compileComponents();
    const fixture = TestBed.createComponent(PhuyuComponent);
    fixture.componentRef.setInput('pose', 'welcome');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('/assets/phuyu/static/phuyu-official.webp');
    expect(image.getAttribute('width')).toBe('512');
    expect(image.getAttribute('height')).toBe('768');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.classList).toContain('phuyu--md');
    expect(image.getAttribute('alt')).toBe('');
    expect(image.getAttribute('aria-hidden')).toBe('true');
  });

  it('supports informative and priority images without hiding them from assistive technology', async () => {
    await TestBed.configureTestingModule({ imports: [PhuyuComponent] }).compileComponents();
    const fixture = TestBed.createComponent(PhuyuComponent);
    fixture.componentRef.setInput('pose', 'support');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('decorative', false);
    fixture.componentRef.setInput('alt', 'Phuyu atendiendo una consulta');
    fixture.componentRef.setInput('priority', true);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('alt')).toBe('Phuyu atendiendo una consulta');
    expect(image.hasAttribute('aria-hidden')).toBe(false);
    expect(image.getAttribute('loading')).toBe('eager');
    expect(image.getAttribute('fetchpriority')).toBe('high');
    expect(image.classList).toContain('phuyu--lg');
  });
});
