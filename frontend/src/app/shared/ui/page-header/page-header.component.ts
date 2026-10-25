import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

const DESKTOP_NAV_BREAKPOINT = 1040;

@Component({
  selector: 'app-page-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');
  private readonly mobileMenu = viewChild<ElementRef<HTMLDialogElement>>('mobileMenu');

  protected readonly menuOpen = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.document.body.classList.remove('menu-open'));
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if ((this.document.defaultView?.innerWidth ?? 0) > DESKTOP_NAV_BREAKPOINT && this.menuOpen()) {
      this.closeMenu();
    }
  }

  protected onDialogCancel(event: Event): void {
    event.preventDefault();
    this.closeMenu();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.mobileMenu()?.nativeElement) this.closeMenu();
  }

  protected toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      return;
    }
    this.mobileMenu()?.nativeElement.showModal();
    this.menuOpen.set(true);
    this.document.body.classList.add('menu-open');
  }

  protected closeMenu(): void {
    const wasOpen = this.menuOpen();
    this.menuOpen.set(false);
    this.document.body.classList.remove('menu-open');
    const dialog = this.mobileMenu()?.nativeElement;
    if (dialog?.open) dialog.close();
    if (wasOpen) this.menuToggle()?.nativeElement.focus();
  }
}
