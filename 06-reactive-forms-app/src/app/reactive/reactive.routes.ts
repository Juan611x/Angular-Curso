import { Routes } from '@angular/router';
import { BasicPage } from './pages/basic-page/basic-page';
import { SwitchesPage } from './pages/switches-page/switches-page';
import { DinamicPage } from './pages/dinamic-page/dinamic-page';

export const reactiveRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic',
        title: 'Basic Form',
        component: BasicPage,
      },
      {
        path: 'dynamic',
        title: 'Dynamic Form',
        component: DinamicPage,
      },
      {
        path: 'switches',
        title: 'Switches Form',
        component: SwitchesPage,
      },
      {
        path: '**',
        component: BasicPage,
      },
    ],
  },
];
