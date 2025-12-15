import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {
  router = inject(Router);

  routes = routes
    .filter((route) => route.path !== '**')
    .map((route) => ({
      path: route.path,
      name: `${route.title ?? 'Maps en Angular'}`,
    }));

  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    // tap((events) => console.log(events)),
    map((event) => event.url),
    map((url) => routes.find((route) => `/${route.path}` === url)?.title ?? 'Maps en Angular')
  );
}
