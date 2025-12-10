import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'basics',
    title: 'Basics Pipes',
    loadComponent: () => import('./pages/basic-page/basic-page'),
  },
  {
    path: 'numbers',
    title: 'Numbers Pipes',
    loadComponent: () => import('./pages/numbers-page/numbers-page'),
  },
  {
    path: 'uncommon',
    title: 'Uncommon Pipes',
    loadComponent: () => import('./pages/uncommon-page/uncommon-page'),
  },
  {
    path: 'custom',
    title: 'Custom Pipes',
    loadComponent: () => import('./pages/custom-page/custom-page'),
  },
  {
    path: '**',
    redirectTo: 'basics',
  },
];
