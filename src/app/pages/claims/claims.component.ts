import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-claims',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimsComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly status = signal('');
  protected readonly claimForm = this.formBuilder.group({
    tipo: ['Reclamo', Validators.required],
    nombre: ['', Validators.required],
    documento: ['', Validators.required],
    domicilio: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    servicio: ['', Validators.required],
    monto: [''],
    detalle: ['', [Validators.required, Validators.minLength(10)]],
    pedido: ['', [Validators.required, Validators.minLength(5)]],
  });

  protected prepareClaim(): void {
    this.claimForm.markAllAsTouched();

    if (this.claimForm.invalid) {
      this.status.set('Completa todos los campos obligatorios antes de continuar.');
      return;
    }

    this.status.set(
      'Vista de implementación: todavía falta conectar el registro, generar el código y enviar la constancia por correo.',
    );
  }
}
