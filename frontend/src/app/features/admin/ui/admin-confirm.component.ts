import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-admin-confirm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dialog
    #dialog
    aria-labelledby="confirmation-title"
    aria-describedby="confirmation-message"
    (cancel)="cancel($event)"
  >
    <h2 id="confirmation-title">{{ title() }}</h2>
    <p id="confirmation-message">{{ message() }}</p>
    @if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    }
    <div class="actions">
      <button type="button" autofocus [disabled]="busy()" (click)="cancelled.emit()">
        Cancelar</button
      ><button type="button" class="confirm" [disabled]="busy()" (click)="confirmed.emit()">
        {{ busy() ? 'Procesando…' : confirmLabel() }}
      </button>
    </div>
  </dialog>`,
  styles: `
    dialog {
      border: 1px solid var(--kq-border);
      border-radius: 1rem;
      max-width: 460px;
      width: calc(100% - 2rem);
      padding: 1.8rem;
      color: var(--kq-ink);
      box-shadow: 0 20px 80px #0003;
    }
    dialog::backdrop {
      background: #0f172a80;
    }
    h2 {
      font-size: 1.4rem;
      margin: 0 0 1rem;
    }
    p {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--kq-muted);
      overflow-wrap: anywhere;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-top: 1.5rem;
    }
    button {
      min-height: 44px;
      padding: 0.7rem 1rem;
      font: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      border: 1px solid var(--kq-control-border);
      border-radius: 0.5rem;
      cursor: pointer;
      background: white;
    }
    .confirm {
      background: var(--kq-action);
      border-color: var(--kq-action);
      color: white;
    }
    .error {
      color: var(--kq-danger);
    }
    button:focus-visible {
      outline: 3px solid var(--kq-action);
      outline-offset: 3px;
    }
    button:disabled {
      opacity: 0.6;
      cursor: wait;
    }
  `,
})
export class AdminConfirmComponent implements OnDestroy {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Confirmar');
  readonly busy = input(false);
  readonly error = input('');
  readonly confirmed = output();
  readonly cancelled = output();
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly document = inject(DOCUMENT);
  private previousFocus: HTMLElement | null = null;
  constructor() {
    afterNextRender(() => {
      const active = this.document.activeElement;
      this.previousFocus = active instanceof HTMLElement ? active : null;
      this.dialog().nativeElement.showModal();
    });
  }
  protected cancel(event: Event): void {
    event.preventDefault();
    if (!this.busy()) this.cancelled.emit();
  }
  ngOnDestroy(): void {
    this.dialog().nativeElement.close();
    if (this.previousFocus?.isConnected) this.previousFocus.focus();
  }
}
