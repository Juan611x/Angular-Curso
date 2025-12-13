import { ChangeDetectionStrategy, Component } from '@angular/core';
import { reactiveRoutes } from '../../../reactive/reactive.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  title: string;
  route: string;
}

const reactiveItems = reactiveRoutes[0].children ?? [];

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css',
})
export class SideMenu {
  reactiveMenu: MenuItem[] = reactiveItems
    .filter((route) => route.path !== '**')
    .map((route) => ({
      title: `${route.title}`,
      route: `reactive/${route.path || ''}`,
    }));

  authMenu: MenuItem[] = [
    {
      title: 'Register',
      route: 'auth/sign-up',
    },
  ];

  countryMenu: MenuItem[] = [
    {
      title: 'Country',
      route: 'country',
    },
  ];
}
