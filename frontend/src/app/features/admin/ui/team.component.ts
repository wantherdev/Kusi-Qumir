import { ChangeDetectionStrategy, Component, OnInit, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TeamApiService, TeamUser } from '../data-access/team-api.service';
import { AdminConfirmComponent } from './admin-confirm.component';
@Component({
  selector: 'app-admin-team',
  imports: [ReactiveFormsModule, AdminConfirmComponent],
  templateUrl: './team.component.html',
  styleUrls: ['./reservations.component.scss', './admin-records.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent implements OnInit {
  readonly dirtyChanged = output<boolean>();
  private readonly api = inject(TeamApiService);
  private readonly fb = inject(FormBuilder);
  protected readonly rows = signal<TeamUser[]>([]);
  protected readonly page = signal(0);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly creating = signal(false);
  protected readonly selected = signal<TeamUser | null>(null);
  protected readonly discarding = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
  });
  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.dirtyChanged.emit(this.form.dirty));
  }
  async ngOnInit(): Promise<void> {
    await this.load();
  }
  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.rows.set(await this.api.list(this.page() * 50));
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.loading.set(false);
    }
  }
  protected async navigate(offset: number): Promise<void> {
    this.page.update((page) => Math.max(0, page + offset));
    await this.load();
  }
  protected open(): void {
    this.form.reset();
    this.creating.set(true);
    this.error.set('');
    this.message.set('');
    this.dirtyChanged.emit(false);
  }
  protected close(): void {
    if (this.form.dirty) this.discarding.set(true);
    else this.reset();
  }
  private reset(): void {
    this.creating.set(false);
    this.form.reset();
    this.dirtyChanged.emit(false);
  }
  protected async save(): Promise<void> {
    this.form.markAllAsTouched();
    this.error.set('');
    if (this.form.invalid) {
      this.error.set('Escribe un correo válido y una contraseña de 8 a 128 caracteres.');
      return;
    }
    if (this.busy()) return;
    this.busy.set(true);
    try {
      const value = this.form.getRawValue();
      await this.api.create(value.email, value.password);
      this.reset();
      this.message.set('Cuenta editora creada. Ya puede ingresar al panel.');
      this.page.set(0);
      await this.load();
    } catch (error) {
      this.form.controls.password.reset();
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected async confirm(): Promise<void> {
    if (this.discarding()) {
      this.discarding.set(false);
      this.reset();
      return;
    }
    const user = this.selected();
    if (!user || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.remove(user);
      this.selected.set(null);
      this.message.set('Cuenta eliminada y acceso revocado.');
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  private describe(error: unknown): string {
    return error instanceof Error
      ? error.message
      : 'No se completó la operación. Vuelve a intentarlo.';
  }
}
