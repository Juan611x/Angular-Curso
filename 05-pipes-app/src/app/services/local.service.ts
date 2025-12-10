import { Injectable, signal } from '@angular/core';

export type avalibleLocales = 'es' | 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private currentLocale = signal<avalibleLocales>('es');

  constructor() {
    this.currentLocale.set((localStorage.getItem('locale') as avalibleLocales) || 'es');
  }

  get getLocale() {
    return this.currentLocale();
  }

  changeLocale(locale: avalibleLocales) {
    localStorage.setItem('locale', locale);
    this.currentLocale.set(locale);
    window.location.reload();
  }
}
