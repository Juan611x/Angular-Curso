import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GifsSideMenuHeader } from '../../components/side-menu/side-menu-header/side-menu-header';
import { GifsSideMenuOptions } from '../../components/side-menu/side-menu-options/side-menu-options';
import { SideMenu } from '../../components/side-menu/side-menu';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, GifsSideMenuHeader, GifsSideMenuOptions, SideMenu],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export default class DashboardPage {}
