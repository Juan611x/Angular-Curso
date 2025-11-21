import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifService } from '../../../services/gifs.service';

interface MenuOption {
  label: string;
  sublabel: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.html',
  styleUrl: './side-menu-options.css',
})
export class GifsSideMenuOptions {
  gifService = inject(GifService);

  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      sublabel: 'Most popular gifs',
      route: '/dashboard/trending',
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Search',
      sublabel: 'Find your favorite gifs',
      route: '/dashboard/search',
    },
    // {
    //   icon: 'fa-solid fa-chart-line',
    //   label: 'Trending',
    //   sublabel: 'Most popular gifs',
    //   route: '/dashboard/trending',
    // },
  ];
}
