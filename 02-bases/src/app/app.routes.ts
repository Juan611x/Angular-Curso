import { Routes } from '@angular/router';
import { CounterPageComponent } from './pages/counter/counter';
import { HeroComponent } from './pages/hero/hero';
import { DragonballComponent } from './pages/dragonball/dragonball';

export const routes: Routes = [

  {
    path: '',
    component: CounterPageComponent,
  },
  {
    path: 'hero',
    component: HeroComponent,
  },
  {
    path: 'dragonball',
    component: DragonballComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }

];
