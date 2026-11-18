import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FaqComponent } from './faq.component';

describe('FaqComponent', () => {
  it('provides usable information and real navigation without collecting visitor data', async () => {
    await TestBed.configureTestingModule({
      imports: [FaqComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(FaqComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const questions = root.querySelectorAll('details');
    expect(questions.length).toBe(9);
    const question = questions[0] as HTMLDetailsElement;
    question.open = true;
    fixture.detectChanges();
    expect(question.open).toBe(true);
    expect(question.querySelector('p')?.textContent).toContain('disponibilidad');
    expect(root.querySelector('a[href="/contacto"]')).toBeTruthy();
    expect(root.textContent).toContain('aún no están habilitados');
  });
});
