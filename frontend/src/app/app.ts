import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet (activate)="onRouteActivate()" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private hasActivatedRoute = false;

  protected onRouteActivate(): void {
    if (!this.isBrowser || !this.hasActivatedRoute) {
      this.hasActivatedRoute = true;
      return;
    }

    const main = this.document.querySelector<HTMLElement>('main');
    if (main) {
      main.tabIndex = -1;
      main.focus({ preventScroll: true });
    }
  }
}
