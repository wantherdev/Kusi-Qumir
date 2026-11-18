import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminTour } from '../data-access/admin-api.service';
import { AdminPackage, PackagesApiService } from '../data-access/packages-api.service';
import { AdminConfirmComponent } from './admin-confirm.component';
@Component({
  selector: 'app-admin-packages',
  imports: [ReactiveFormsModule, AdminConfirmComponent],
  templateUrl: './packages.component.html',
  styleUrls: ['./reservations.component.scss', './admin-records.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesComponent implements OnInit {
  readonly tours = input.required<AdminTour[]>();
  readonly owner = input(false);
  readonly dirtyChanged = output<boolean>();
  private readonly api = inject(PackagesApiService);
  private readonly fb = inject(FormBuilder);
  protected readonly rows = signal<AdminPackage[]>([]);
  protected readonly search = signal('');
  protected readonly filtered = computed(() =>
    this.rows().filter((row) =>
      row.title.toLocaleLowerCase('es').includes(this.search().trim().toLocaleLowerCase('es')),
    ),
  );
  protected readonly deleted = signal(false);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly editing = signal(false);
  protected readonly selected = signal<AdminPackage | null>(null);
  protected readonly confirmation = signal<
    { kind: 'archive'; row: AdminPackage } | { kind: 'discard' } | null
  >(null);
  protected readonly form = this.fb.nonNullable.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/\S/),
      ],
    ],
    description: ['', Validators.maxLength(400)],
    itinerary: new FormArray([this.fb.nonNullable.control(''), this.fb.nonNullable.control('')]),
  });
  protected get days() {
    return this.form.controls.itinerary;
  }
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
      this.rows.set(await this.api.list(this.deleted()));
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.loading.set(false);
    }
  }
  protected open(row: AdminPackage | null = null): void {
    this.selected.set(row);
    this.editing.set(true);
    this.error.set('');
    this.message.set('');
    this.days.clear();
    for (const day of row?.itinerary ?? [null, null])
      this.days.push(this.fb.nonNullable.control(day ?? ''));
    this.form.reset({
      title: row?.title ?? '',
      description: row?.description ?? '',
      itinerary: (row?.itinerary ?? [null, null]).map((day) => day ?? ''),
    });
    this.dirtyChanged.emit(false);
  }
  protected addDay(): void {
    if (this.days.length >= 30) return;
    this.days.push(this.fb.nonNullable.control(''));
    this.form.markAsDirty();
    this.dirtyChanged.emit(true);
  }
  protected removeDay(index: number): void {
    if (this.days.length <= 1) return;
    this.days.removeAt(index);
    this.form.markAsDirty();
    this.dirtyChanged.emit(true);
  }
  protected hasTour(slug: string): boolean {
    return this.tours().some((tour) => tour.slug === slug);
  }
  protected dayTitle(slug: string | null): string {
    return slug ? (this.tours().find((tour) => tour.slug === slug)?.title ?? slug) : 'Día libre';
  }
  protected close(): void {
    if (this.form.dirty) this.confirmation.set({ kind: 'discard' });
    else this.closeForm();
  }
  private closeForm(): void {
    this.editing.set(false);
    this.selected.set(null);
    this.form.markAsPristine();
    this.dirtyChanged.emit(false);
  }
  protected async save(): Promise<void> {
    this.form.markAllAsTouched();
    this.error.set('');
    if (this.form.invalid || this.days.length < 1) {
      this.error.set(
        'Escribe un nombre de 2 a 100 caracteres, una descripción de hasta 400 y entre 1 y 30 días.',
      );
      return;
    }
    await this.run(async () => {
      const value = this.form.getRawValue();
      await this.api.save(
        { ...value, itinerary: value.itinerary.map((day) => day || null) },
        this.selected(),
      );
      this.closeForm();
      this.message.set('Paquete guardado.');
      await this.load();
    });
  }
  protected async visibility(row: AdminPackage): Promise<void> {
    await this.run(async () => {
      await this.api.visibility(row);
      this.message.set(row.active ? 'Paquete pasado a borrador.' : 'Paquete publicado.');
      await this.load();
    });
  }
  protected async switchDeleted(): Promise<void> {
    this.deleted.update((value) => !value);
    this.search.set('');
    await this.load();
  }
  protected requestArchive(row: AdminPackage): void {
    this.confirmation.set({ kind: 'archive', row });
  }
  protected confirmationTitle(): string {
    return this.confirmation()?.kind === 'archive'
      ? '¿Eliminar este paquete?'
      : '¿Descartar los cambios?';
  }
  protected async confirm(): Promise<void> {
    const action = this.confirmation();
    if (!action) return;
    if (action.kind === 'discard') {
      this.confirmation.set(null);
      this.closeForm();
      return;
    }
    await this.run(async () => {
      await this.api.archive(action.row);
      this.confirmation.set(null);
      this.message.set('Paquete movido a eliminados.');
      await this.load();
    });
  }
  protected async restore(row: AdminPackage): Promise<void> {
    await this.run(async () => {
      await this.api.restore(row);
      this.message.set('Paquete restaurado como borrador.');
      await this.load();
    });
  }
  private async run(action: () => Promise<void>): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await action();
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
