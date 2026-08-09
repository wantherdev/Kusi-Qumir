import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly document = inject(DOCUMENT);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly currentYear = new Date().getFullYear();
  protected readonly menuOpen = signal(false);
  protected readonly headerScrolled = signal(false);
  protected readonly formStatus = signal('');
  protected readonly newsletterStatus = signal('');

  protected readonly contactForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    telefono: ['', [Validators.required, Validators.minLength(7)]],
    fecha: [''],
    viajeros: [2, [Validators.required, Validators.min(1), Validators.max(30)]],
    interes: ['Cultura e historia', Validators.required],
    mensaje: [''],
  });

  constructor() {
    afterNextRender(() => {
      const elements = this.document.querySelectorAll<HTMLElement>('.reveal');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('visible'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 },
      );

      elements.forEach((element) => observer.observe(element));
    });
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.headerScrolled.set(window.scrollY > 20);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.document.body.classList.toggle('menu-open', this.menuOpen());
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.document.body.classList.remove('menu-open');
  }

  protected submitConsultation(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.formStatus.set('Completa tu nombre y un número de contacto válido para continuar.');
      return;
    }

    this.formStatus.set(
      'El formulario está listo, pero el canal oficial aún debe conectarse antes de publicar la web.',
    );
  }

  protected submitNewsletter(event: SubmitEvent, email: HTMLInputElement): void {
    event.preventDefault();

    if (!email.reportValidity()) return;

    this.newsletterStatus.set(
      'La suscripción se habilitará cuando el canal oficial esté conectado.',
    );
  }
}
