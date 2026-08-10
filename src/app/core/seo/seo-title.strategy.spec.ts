import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../../app.routes';
import { SeoTitleStrategy } from './seo-title.strategy';

describe('SeoTitleStrategy', () => {
  it('updates title and description for a public route', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), { provide: TitleStrategy, useClass: SeoTitleStrategy }],
    });

    await RouterTestingHarness.create('/privacidad');

    expect(TestBed.inject(Title).getTitle()).toBe('Política de privacidad | Kusi Q’umir');
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toContain(
      'no constituye una política vigente',
    );
    expect(TestBed.inject(Meta).getTag('property="og:title"')?.content).toBe(
      'Política de privacidad | Kusi Q’umir',
    );
  });
});
