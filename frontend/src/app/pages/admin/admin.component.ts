import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AdminApiService,
  AdminTour,
  TourRecord,
} from '../../features/admin/data-access/admin-api.service';
import {
  TourDayDraft,
  buildTourDraft,
  buildTourUpdate,
  tourToDraft,
  safeImageUrl,
  slugFromTitle,
} from '../../features/admin/domain/tour-draft';
import {
  TourDifficulty,
  TourGroupType,
  TourOperationType,
  TourServiceType,
} from '../../features/tours/domain/tour.model';
import { AdminConfirmComponent } from '../../features/admin/ui/admin-confirm.component';
import {
  TourImagesService,
  validateTourImage,
} from '../../features/admin/data-access/tour-images.service';
import { ReservationsComponent } from '../../features/admin/ui/reservations.component';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, RouterLink, AdminConfirmComponent, ReservationsComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit, OnDestroy {
  protected readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly images = inject(TourImagesService);
  protected readonly selectedImage = signal<File | null>(null);
  protected readonly imagePreview = signal('');
  protected readonly imageError = signal('');
  private previewObjectUrl: string | null = null;
  protected readonly section = signal<'tours' | 'reservations'>('tours');
  protected readonly reservationDirty = signal(false);
  protected readonly deleted = signal(false);
  protected readonly editing = signal<TourRecord | null>(null);
  protected readonly confirmation = signal<
    { kind: 'delete'; tour: AdminTour } | { kind: 'discard' } | null
  >(null);
  protected readonly busy = signal(false);
  protected readonly loadingTours = signal(false);
  protected readonly listError = signal('');
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly tours = signal<AdminTour[]>([]);
  protected readonly creating = signal(false);
  protected readonly published = computed(() => this.tours().filter((tour) => tour.active).length);
  protected readonly login = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly form = this.fb.group({
    title: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(150),
      Validators.pattern(/\S/),
    ]),
    slug: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    ]),
    code: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(40),
      Validators.pattern(/\S/),
    ]),
    subtitle: this.fb.nonNullable.control('', Validators.maxLength(200)),
    shortDescription: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(400),
      Validators.pattern(/\S/),
    ]),
    description: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(12000),
      Validators.pattern(/\S/),
    ]),
    durationHours: this.fb.nonNullable.control(8, [
      Validators.required,
      Validators.min(1),
      Validators.max(720),
      Validators.pattern(/^\d+$/),
    ]),
    difficulty: this.fb.nonNullable.control<TourDifficulty>('Facil'),
    groupType: this.fb.nonNullable.control<TourGroupType>('Compartido'),
    serviceType: this.fb.nonNullable.control<TourServiceType>('DiaCompleto'),
    operationType: this.fb.nonNullable.control<TourOperationType>('PROPIO'),
    categorySlug: this.fb.nonNullable.control('cultural'),
    featured: this.fb.nonNullable.control(false),
    adult: this.fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(0.01),
      Validators.max(100000),
    ]),
    child: this.fb.control<number | null>(null, [Validators.min(0), Validators.max(100000)]),
    imageUrl: this.fb.nonNullable.control('', [
      (control) =>
        this.selectedImage() || safeImageUrl(String(control.value).trim())
          ? null
          : { imageUrl: true },
    ]),
    imageAlt: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(250),
      Validators.pattern(/\S/),
    ]),
    includes: this.fb.nonNullable.control(''),
    excludes: this.fb.nonNullable.control(''),
    requirements: this.fb.nonNullable.control(''),
    recommendations: this.fb.nonNullable.control(''),
    itinerary: new FormArray([this.createDay()]),
  });
  protected get days() {
    return this.form.controls.itinerary;
  }
  async ngOnInit(): Promise<void> {
    await this.initialize();
  }
  protected async initialize(): Promise<void> {
    await this.api.initialize();
    if (this.api.access() === 'allowed') await this.load();
  }
  protected async signIn(): Promise<void> {
    if (this.busy()) return;
    this.error.set('');
    this.login.markAllAsTouched();
    if (this.login.invalid) {
      this.error.set('Escribe un correo válido y tu contraseña.');
      return;
    }
    this.busy.set(true);
    try {
      const { email, password } = this.login.getRawValue();
      await this.api.signIn(email.trim(), password);
      this.login.controls.password.reset();
      if (this.api.access() === 'allowed') await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected async signOut(): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.signOut();
      this.tours.set([]);
      this.section.set('tours');
      this.editing.set(null);
      this.reservationDirty.set(false);
      this.message.set('');
      this.creating.set(false);
      this.resetForm();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected async load(): Promise<void> {
    this.loadingTours.set(true);
    this.listError.set('');
    try {
      this.tours.set(await this.api.list(this.deleted()));
    } catch (error) {
      this.listError.set(this.describe(error));
    } finally {
      this.loadingTours.set(false);
    }
  }
  protected suggestSlug(): void {
    if (!this.editing() && !this.form.controls.slug.dirty)
      this.form.controls.slug.setValue(slugFromTitle(this.form.controls.title.value));
  }
  private createActivity(activity?: TourDayDraft['activities'][number]) {
    return this.fb.nonNullable.group({
      time: [activity?.time ?? '', Validators.maxLength(80)],
      title: [
        activity?.title ?? '',
        [Validators.required, Validators.maxLength(200), Validators.pattern(/\S/)],
      ],
      description: [activity?.description ?? '', Validators.maxLength(6000)],
      duration: [activity?.duration ?? 0],
    });
  }
  private createDay(day?: TourDayDraft) {
    return this.fb.nonNullable.group({
      title: [
        day?.title ?? '',
        [Validators.required, Validators.maxLength(150), Validators.pattern(/\S/)],
      ],
      activities: new FormArray(
        day?.activities.length
          ? day.activities.map((activity) => this.createActivity(activity))
          : [this.createActivity()],
      ),
    });
  }
  protected addDay(): void {
    if (this.days.length < 30) {
      this.days.push(this.createDay());
      this.form.markAsDirty();
    }
  }
  protected removeDay(index: number): void {
    if (this.days.length > 1) {
      this.days.removeAt(index);
      this.form.markAsDirty();
    }
  }
  protected addActivity(dayIndex: number): void {
    const activities = this.days.at(dayIndex).controls.activities;
    if (activities.length < 60) {
      activities.push(this.createActivity());
      this.form.markAsDirty();
    }
  }
  protected removeActivity(dayIndex: number, index: number): void {
    const activities = this.days.at(dayIndex).controls.activities;
    if (activities.length > 1) {
      activities.removeAt(index);
      this.form.markAsDirty();
    }
  }
  protected async save(): Promise<void> {
    if (this.busy()) return;
    this.error.set('');
    this.message.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid || this.imageError()) {
      this.error.set('Revisa los campos señalados antes de guardar.');
      return;
    }
    this.busy.set(true);
    try {
      const image = this.selectedImage();
      if (image) {
        const url = await this.images.upload(image);
        this.form.controls.imageUrl.setValue(url);
        this.selectedImage.set(null);
        this.releasePreview();
        this.imagePreview.set(url);
      }
      const editing = this.editing();
      if (editing) {
        const patch = buildTourUpdate(editing, this.form.getRawValue());
        if (Object.keys(patch).length)
          await this.api.updateTour(editing.id, editing.updatedAt, patch);
      } else await this.api.create(buildTourDraft(this.form.getRawValue()));
      this.resetForm();
      this.creating.set(false);
      this.editing.set(null);
      this.message.set(
        editing
          ? 'Tour actualizado.'
          : 'Tour guardado como borrador. Puedes publicarlo desde el listado.',
      );
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected async toggle(tour: AdminTour): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    try {
      await this.api.setVisibility(tour.id, !tour.active, tour.updatedAt);
      this.message.set(
        tour.active
          ? 'Tour retirado del catálogo. Se conserva como borrador.'
          : 'Tour publicado en el catálogo conectado a Supabase.',
      );
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }

  protected async selectSection(section: 'tours' | 'reservations'): Promise<void> {
    if (this.busy() || this.loadingTours()) return;
    if ((this.creating() && this.form.dirty) || this.reservationDirty()) {
      this.error.set('Guarda o cancela los cambios antes de cambiar de sección.');
      return;
    }
    this.error.set('');
    this.message.set('');
    this.creating.set(false);
    this.editing.set(null);
    this.resetForm();
    this.deleted.set(false);
    this.section.set(section);
    await this.load();
  }
  protected toggleEditor(): void {
    this.error.set('');
    this.message.set('');
    if (this.creating()) {
      if (this.form.dirty) this.confirmation.set({ kind: 'discard' });
      else {
        this.creating.set(false);
        this.editing.set(null);
      }
    } else {
      this.resetForm();
      this.editing.set(null);
      this.creating.set(true);
    }
  }
  protected async editTour(tour: AdminTour): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    try {
      const record = await this.api.getTour(tour.id);
      const { itinerary, ...draft } = tourToDraft(record);
      this.clearImageSelection();
      this.form.reset(draft);
      this.imagePreview.set(draft.imageUrl);
      this.days.clear();
      for (const day of itinerary) this.days.push(this.createDay(day));
      if (!itinerary.length) this.addDay();
      this.form.markAsPristine();
      this.editing.set(record);
      this.creating.set(true);
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected async switchDeleted(): Promise<void> {
    this.deleted.update((value) => !value);
    this.message.set('');
    await this.load();
  }
  protected requestDelete(tour: AdminTour): void {
    this.error.set('');
    this.confirmation.set({ kind: 'delete', tour });
  }
  protected confirmationTitle(): string {
    return this.confirmation()?.kind === 'delete'
      ? '¿Eliminar este tour?'
      : '¿Descartar los cambios?';
  }
  protected confirmationMessage(): string {
    const action = this.confirmation();
    return action?.kind === 'delete'
      ? `«${action.tour.title}» se moverá a eliminados y saldrá del catálogo. Sus reservas se conservarán. Podrás restaurarlo como borrador.`
      : 'Los cambios que aún no has guardado se perderán.';
  }
  protected async confirm(): Promise<void> {
    const action = this.confirmation();
    if (!action || this.busy()) return;
    if (action.kind === 'discard') {
      this.confirmation.set(null);
      this.creating.set(false);
      this.editing.set(null);
      this.resetForm();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.archiveTour(action.tour);
      this.confirmation.set(null);
      this.message.set('Tour movido a eliminados. Sus reservas se conservan.');
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected async restoreTour(tour: AdminTour): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.restoreTour(tour);
      this.message.set('Tour restaurado como borrador.');
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected invalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control?.touched && !!control.invalid;
  }
  protected chooseImage(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.busy()) return;
    this.imageError.set('');
    try {
      validateTourImage(file);
      this.releasePreview();
      this.selectedImage.set(file);
      this.previewObjectUrl = URL.createObjectURL(file);
      this.imagePreview.set(this.previewObjectUrl);
      this.form.controls.imageUrl.updateValueAndValidity();
      this.form.markAsDirty();
    } catch (error) {
      this.imageError.set(this.describe(error));
    }
  }
  protected clearImageSelection(): void {
    this.selectedImage.set(null);
    this.imageError.set('');
    this.releasePreview();
    this.imagePreview.set(this.form.controls.imageUrl.value);
    this.form.controls.imageUrl.updateValueAndValidity();
  }
  private releasePreview(): void {
    if (this.previewObjectUrl) URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }
  ngOnDestroy(): void {
    this.releasePreview();
  }
  private resetForm(): void {
    this.clearImageSelection();
    this.imagePreview.set('');
    this.form.reset();
    this.days.clear();
    this.addDay();
    this.form.markAsPristine();
  }
  private describe(error: unknown): string {
    return error instanceof Error
      ? error.message
      : 'No se completó la operación. Inténtalo de nuevo.';
  }
}
