import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

import localEs from '@angular/common/locales/es';
import localFr from '@angular/common/locales/fr';
import { LocalService } from './services/local.service';

registerLocaleData(localEs, 'es');
registerLocaleData(localFr, 'fr');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    {
      provide: LOCALE_ID,
      // useValue: 'es',
      deps: [LocalService],
      useFactory: (localService: LocalService) => localService.getLocale,
    },
  ],
};
