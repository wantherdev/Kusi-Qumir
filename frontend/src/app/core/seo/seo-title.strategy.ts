import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const defaultTitle = 'Tours en Cusco y Machu Picchu | Kusi Q’umir';
const officialOrigin = 'https://kusiqumir.com';
const defaultImage = `${officialOrigin}/assets/images/machu-picchu-portada-v2.jpg`;
const defaultDescription =
  'Compara tours en Cusco, Machu Picchu, Valle Sagrado, Laguna Humantay y Vinicunca. Revisa itinerarios, dificultad, inclusiones y precios referenciales.';

export function tourSocialImage(image: string): string {
  try {
    const url = new URL(image, officialOrigin);
    if (url.protocol === 'https:') return url.href;
  } catch {
    // An invalid catalog image should not break page metadata.
  }
  return defaultImage;
}

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
    this.meta.updateTag({ property: 'og:image', content: defaultImage });
    this.meta.updateTag({ name: 'twitter:image', content: defaultImage });
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
