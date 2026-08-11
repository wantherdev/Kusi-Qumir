import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const defaultTitle = 'Kusi Q’umir | Cusco auténtico, experiencias que permanecen';
const defaultDescription =
  'Tours propios y de terceros en Cusco mediante una agencia minorista y operadora exclusivamente digital, actualmente en evaluación institucional.';

@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? defaultTitle;
    const description = this.findDescription(snapshot) ?? defaultDescription;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  private findDescription(snapshot: RouterStateSnapshot): string | null {
    let route = snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const description: unknown = route.data['description'];
    return typeof description === 'string' ? description : null;
  }
}
