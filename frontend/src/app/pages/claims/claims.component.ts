import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { agencyProfile } from '../../config/agency-profile';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

type ClaimFeedback = { kind: 'error' | 'success'; message: string };

@Component({
  selector: 'app-claims',
  imports: [PageHeaderComponent, ReactiveFormsModule, SiteFooterComponent],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimsComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly claimFormElement =
    viewChild.required<ElementRef<HTMLFormElement>>('claimFormElement');

  protected readonly profile = agencyProfile;
  protected readonly feedback = signal<ClaimFeedback | null>(null);
  protected readonly claimForm = this.formBuilder.group({
    tipo: ['Reclamo', Validators.required],
    nombre: ['', Validators.required],
    menorEdad: [false],
    apoderado: [''],
    documento: ['', Validators.required],
    domicilio: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    servicio: ['', Validators.required],
    monto: [''],
    detalle: ['', [Validators.required, Validators.minLength(10)]],
    pedido: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor() {
    this.claimForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.feedback.set(null));
  }

  protected prepareClaim(): void {
    this.claimForm.markAllAsTouched();

    if (this.claimForm.invalid) {
      this.feedback.set({
        kind: 'error',
        message: 'Revisa los campos marcados antes de validar la vista del formulario.',
      });
      this.focusFirstInvalidControl();
      return;
    }

    this.feedback.set({
      kind: 'success',
      message: 'Vista validada. No se registró ningún reclamo ni se almacenaron los datos.',
    });
  }

  protected updateGuardianRequirement(): void {
    const guardian = this.claimForm.controls.apoderado;

    if (this.claimForm.controls.menorEdad.value) {
      guardian.setValidators(Validators.required);
    } else {
      guardian.clearValidators();
      guardian.reset('');
    }

    guardian.updateValueAndValidity();
  }

  private focusFirstInvalidControl(): void {
    const firstInvalidControlName = Object.keys(this.claimForm.controls).find(
      (controlName) => this.claimForm.get(controlName)?.invalid,
    );

    if (firstInvalidControlName) {
      this.claimFormElement()
        .nativeElement.querySelector<HTMLElement>(`[formControlName="${firstInvalidControlName}"]`)
        ?.focus();
    }
  }
}
