import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Kusi Q’umir | Cusco auténtico, experiencias que permanecen',
    data: {
      description:
        'Tours propios y de terceros en Cusco mediante una agencia minorista y operadora exclusivamente digital, actualmente en evaluación institucional.',
    },
    loadComponent: () =>
      import('./pages/landing/landing.component').then((module) => module.LandingComponent),
  },
  {
    path: 'tours',
    title: 'Tours en Cusco | Kusi Q’umir',
    data: {
      description:
        'Catálogo vigente de tours de Kusi Q’umir en Cusco con itinerarios, precios referenciales e información práctica.',
    },
    loadComponent: () =>
      import('./pages/tours/tours.component').then((module) => module.ToursComponent),
  },
  {
    path: 'tours/:slug',
    title: 'Detalle del tour | Kusi Q’umir',
    data: {
      description: 'Itinerario, inclusiones, requisitos y precios del tour seleccionado.',
    },
    loadComponent: () =>
      import('./pages/tour-detail/tour-detail.component').then(
        (module) => module.TourDetailComponent,
      ),
  },
  {
    path: 'informacion-institucional',
    title: 'Información institucional | Kusi Q’umir',
    data: {
      description:
        'Ficha de Kusi Q’umir como agencia minorista y operadora exclusivamente digital: modalidad Anexo II, identidad y controles previstos.',
    },
    loadComponent: () =>
      import('./pages/agency-info/agency-info.component').then(
        (module) => module.AgencyInfoComponent,
      ),
  },
  {
    path: 'privacidad',
    title: 'Política de privacidad | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/legal/legal.component').then((module) => module.LegalComponent),
    data: {
      document: 'privacy',
      description:
        'Borrador informativo de privacidad de Kusi Q’umir para evaluación institucional; no constituye una política vigente.',
    },
  },
  {
    path: 'terminos',
    title: 'Términos y condiciones | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/legal/legal.component').then((module) => module.LegalComponent),
    data: {
      document: 'terms',
      description:
        'Borrador de términos y condiciones de Kusi Q’umir para evaluación institucional, sin operaciones comerciales activas.',
    },
  },
  {
    path: 'cancelaciones',
    title: 'Política de cancelaciones y reembolsos | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/legal/legal.component').then((module) => module.LegalComponent),
    data: {
      document: 'cancelaciones',
      description:
        'Propuesta de política de cancelaciones y reembolsos de Kusi Q’umir, pendiente de aprobación y sin operaciones activas.',
    },
  },
  {
    path: 'turismo-responsable',
    title: 'Turismo responsable y protección de la niñez | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/legal/legal.component').then((module) => module.LegalComponent),
    data: {
      document: 'responsibleTourism',
      description:
        'Compromisos previstos de turismo responsable y protección de la niñez para el canal digital de Kusi Q’umir.',
    },
  },
  {
    path: 'libro-de-reclamaciones',
    title: 'Libro de Reclamaciones | Kusi Q’umir',
    data: {
      description:
        'Vista demostrativa del Libro de Reclamaciones de Kusi Q’umir; todavía no registra ni transmite reclamos reales.',
    },
    loadComponent: () =>
      import('./pages/claims/claims.component').then((module) => module.ClaimsComponent),
  },
  {
    path: '**',
    title: 'Página no encontrada | Kusi Q’umir',
    data: {
      description: 'La página solicitada no existe en el canal digital de Kusi Q’umir.',
    },
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((module) => module.NotFoundComponent),
  },
];
