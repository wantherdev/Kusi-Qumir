import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  it('provides usable information and real navigation without collecting visitor data', async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(
      root.querySelector('a[href="https://wa.me/51908990666"]')?.getAttribute('rel'),
    ).toContain('noopener');
    expect(root.querySelector('a[href="tel:+51908990666"]')).toBeTruthy();
    expect(root.querySelector('a[href="mailto:kusiqumir@gmail.com"]')).toBeTruthy();
    expect(root.querySelector('form')).toBeNull();
    expect(root.querySelector('a[href="/preguntas-frecuentes"]')).toBeTruthy();
  });
});
