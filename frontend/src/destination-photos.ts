interface DestinationPhoto {
  alt: string;
  width: number;
  small: string;
  smallWidth: number;
  credit: { author: string; url: string; license: string; license_url: string };
}

const photos: Readonly<Record<string, DestinationPhoto>> = {
  'tour-valle-sagrado.webp': {
    alt: 'Terrazas y montañas de Ollantaytambo en el Valle Sagrado',
    width: 1920,
    small: 'tour-valle-sagrado-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Tydence Davis',
      url: 'https://commons.wikimedia.org/wiki/File:Ruins_at_Ollantaytambo.jpg',
      license: 'CC BY 2.0',
      license_url: 'https://creativecommons.org/licenses/by/2.0',
    },
  },
  'tour-montana-colores.webp': {
    alt: 'Franjas minerales de Vinicunca bajo un cielo azul',
    width: 1920,
    small: 'tour-montana-colores-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Steve FUNG',
      url: 'https://commons.wikimedia.org/wiki/File:Vinicunca_(Rainbow_Mountain).jpg',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  },
  'tour-city-tour-cusco.webp': {
    alt: 'Muros de piedra de Sacsayhuamán bajo el cielo de Cusco',
    width: 1920,
    small: 'tour-city-tour-cusco-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Diego Delso',
      url: 'https://commons.wikimedia.org/wiki/File:Sacsayhuam%C3%A1n,_Cusco,_Per%C3%BA,_2015-07-31,_DD_05.JPG',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  },
  'tour-laguna-humantay.webp': {
    alt: 'Laguna Humantay y nevados de los Andes',
    width: 1280,
    small: 'tour-laguna-humantay-960.webp',
    smallWidth: 640,
    credit: {
      author: 'Draceane',
      url: 'https://commons.wikimedia.org/wiki/File:Humantay,_2023_(37).jpg',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  },
  'tour-machu-picchu-full-day.webp': {
    alt: 'Ciudadela de Machu Picchu rodeada de montañas',
    width: 1920,
    small: 'tour-machu-picchu-full-day-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Martin St-Amant (S23678)',
      url: 'https://commons.wikimedia.org/wiki/File:80_-_Machu_Picchu_-_Juin_2009_-_edit.2.jpg',
      license: 'CC BY-SA 3.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/3.0',
    },
  },
  'tour-maras-moray.webp': {
    alt: 'Andenes circulares de Moray en tonos tierra',
    width: 1920,
    small: 'tour-maras-moray-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Laslovarga',
      url: 'https://commons.wikimedia.org/wiki/File:Moray,_Peru_-_Laslovarga_(7).jpg',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  },
  'tour-valle-sur.webp': {
    alt: 'Terrazas incas de Tipón en el Valle Sur',
    width: 1920,
    small: 'tour-valle-sur-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Charlesdarling',
      url: 'https://commons.wikimedia.org/wiki/File:Incan_Terraces_in_Tipon,_Per%C3%BA.jpg',
      license: 'CC0',
      license_url: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    },
  },
  'tour-waqrapukara.webp': {
    alt: 'Formaciones rocosas y recinto arqueológico de Waqrapukara',
    width: 1920,
    small: 'tour-waqrapukara-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Raul lhan',
      url: 'https://commons.wikimedia.org/wiki/File:Sitio_Arqueol%C3%B3gico_de_Waqrapukara,.jpg',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  },
  'tour-puente-qeswachaka.webp': {
    alt: 'Puente de fibra vegetal Q’eswachaka sobre el río Apurímac',
    width: 1920,
    small: 'tour-puente-qeswachaka-960.webp',
    smallWidth: 960,
    credit: {
      author: 'Aga Khan (IT)',
      url: 'https://commons.wikimedia.org/wiki/File:Inka_suspension_bridge_Qeswachaka_DSC_2730.jpg',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  },
  'tour-palcoyo.webp': {
    alt: 'Laderas de colores de la cordillera de Palcoyo',
    width: 1920,
    small: 'tour-palcoyo-960.webp',
    smallWidth: 960,
    credit: {
      author: 'PsamatheM',
      url: 'https://commons.wikimedia.org/wiki/File:02-Cordillera_Arco%C3%ADris_de_Palccoyo-nX-7.jpg',
      license: 'CC BY-SA 4.0',
      license_url: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  },
};

const creditsPage = 'creditos-fotograficos.html';

export function mountDestinationPhotos(document: Document): void {
  const root = document.querySelector('app-root');
  if (!root) return;

  const assets = new URL('assets/images/', document.baseURI);
  const imageUrl = (file: string) => new URL(file, assets).href;
  const creditLink = (label: string, href: string) => {
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = href;
    return anchor;
  };

  function updateImage(img: HTMLImageElement): void {
    const card = img.closest('.tour-card');
    const host = card?.querySelector('.tour-card__content') ?? img.closest('.tour-hero');
    if (!host) return;

    const url = new URL(img.src, document.baseURI);
    const localFile =
      url.origin === assets.origin && url.pathname.startsWith(assets.pathname)
        ? url.pathname.slice(assets.pathname.length)
        : '';
    const file = localFile.replace(/-editorial-v2\.webp$/, '.webp');
    const photo = Object.hasOwn(photos, file) ? photos[file] : undefined;
    let credit = host.querySelector<HTMLParagraphElement>('.tour-photo-credit');

    if (!photo) {
      if (img.dataset['kqPhoto']) {
        delete img.dataset['kqPhoto'];
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
      }
      credit?.remove();
      return;
    }

    if (file !== localFile) img.src = imageUrl(file);
    if (img.dataset['kqPhoto'] === file) return;

    img.dataset['kqPhoto'] = file;
    img.alt = photo.alt;
    img.srcset = `${imageUrl(photo.small)} ${photo.smallWidth}w, ${imageUrl(file)} ${photo.width}w`;
    img.sizes = card
      ? '(max-width: 640px) 140vw, (max-width: 1023px) 75vw, 640px'
      : '(max-width: 760px) 100vw, 50vw';

    if (!credit) {
      credit = document.createElement('p');
      credit.className = 'tour-photo-credit';
      host.append(credit);
    }
    const { author, url: source, license, license_url } = photo.credit;
    credit.replaceChildren(
      'Foto: ',
      creditLink(author, source),
      ' · ',
      creditLink(license, license_url),
    );
  }

  function refresh(): void {
    root
      ?.querySelectorAll<HTMLImageElement>('.tour-card__art img[src], .tour-hero > img[src]')
      .forEach(updateImage);

    const footer = root?.querySelector('.footer-copyright');
    if (footer && !footer.querySelector('.photo-credits-link')) {
      const link = creditLink('Fotografías y créditos', imageUrl(creditsPage));
      link.className = 'photo-credits-link';
      footer.append(' ', link);
    }
  }

  refresh();
  new MutationObserver(refresh).observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src'],
  });
}
