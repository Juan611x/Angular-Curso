import { DatePipe, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, LOCALE_ID, signal } from '@angular/core';
import { LocalService, avalibleLocales } from '../../services/local.service';

@Component({
  selector: 'app-basic-page',
  imports: [LowerCasePipe, UpperCasePipe, TitleCasePipe, DatePipe],
  templateUrl: './basic-page.html',
  styleUrl: './basic-page.css',
})
export default class BasicPage {
  localeService = inject(LocalService);
  currentLocale = signal(inject(LOCALE_ID));

  nameLower = signal('Juan Ignacio');
  nameUpper = signal('JUAN IGNACIO');
  fullName = signal('JuAn IQNaCiO');

  customDate = signal(new Date());

  tickingDateEffect = effect((onCleanup) => {
    const interval = setInterval(() => {
      this.customDate.set(new Date());
      console.log('tick');
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  changeLocal(locale: avalibleLocales) {
    this.localeService.changeLocale(locale);
  }
}
