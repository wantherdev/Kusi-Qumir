import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { agencyProfile } from '../../config/agency-profile';

type FormFeedback = { kind: 'error' | 'success'; message: string };

@Component({
  selector: 'app-landing',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');

  protected readonly currentYear = new Date().getFullYear();
  protected readonly agencyProfile = agencyProfile;
  protected readonly menuOpen = signal(false);
  protected readonly headerScrolled = signal(false);
  protected readonly formFeedback = signal<FormFeedback | null>(null);

  protected readonly contactForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    telefono: ['', [Validators.required, Validators.minLength(7)]],
    fecha: [''],
    viajeros: [2, [Validators.required, Validators.min(1), Validators.max(30)]],
    interes: ['Cultura e historia', Validators.required],
    mensaje: [''],
  });

  constructor() {
    afterNextRender(() => this.onWindowScroll());
    this.destroyRef.onDestroy(() => this.document.body.classList.remove('menu-open'));
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.headerScrolled.set(window.scrollY > 20);
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (window.innerWidth > 900 && this.menuOpen()) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      this.menuToggle()?.nativeElement.focus();
    }
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
      this.formFeedback.set({
        kind: 'error',
        message: 'Revisa los campos marcados antes de validar la vista del formulario.',
      });
      return;
    }

    this.formFeedback.set({
      kind: 'success',
      message: 'Vista validada. En esta etapa los datos no se transmiten ni se almacenan.',
    });
  }
}
