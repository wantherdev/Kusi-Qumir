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
  });

  it('validates the contact fields before preparing a consultation', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLParagraphElement;
    expect(status.textContent).toContain('Completa tu nombre');
  });
});
