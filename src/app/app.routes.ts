import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Kusi Q’umir | Cusco auténtico, experiencias que permanecen',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((module) => module.LandingComponent),
  },
  {
    path: 'privacidad',
    title: 'Política de privacidad | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/legal/legal.component').then((module) => module.LegalComponent),
    data: { document: 'privacy' },
  },
  {
    path: 'terminos',
    title: 'Términos y condiciones | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/legal/legal.component').then((module) => module.LegalComponent),
    data: { document: 'terms' },
  },
  {
    path: 'turismo-responsable',
    title: 'Turismo responsable y protección de la niñez | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/legal/legal.component').then((module) => module.LegalComponent),
    data: { document: 'responsibleTourism' },
  },
  {
    path: 'libro-de-reclamaciones',
    title: 'Libro de Reclamaciones | Kusi Q’umir',
    loadComponent: () =>
      import('./pages/claims/claims.component').then((module) => module.ClaimsComponent),
  },
  { path: '**', redirectTo: '' },
];
