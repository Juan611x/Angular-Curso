import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({ providedIn: 'root' })
export class CountrySeviceService {
  private baseURL = 'https://restcountries.com/v3.1/';
  httpClient = inject(HttpClient);

  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);
    const url = `${this.baseURL}region/${region}?fields=cca3,name,borders`;
    return this.httpClient.get<Country[]>(url);
  }

  getCountryByCode(code: string): Observable<Country> {
    const url = `${this.baseURL}alpha/${code}?fields=cca3,name,borders`;
    return this.httpClient.get<Country>(url);
  }

  getCountryBordesByCodes(borders: string[]): Observable<Country[]> {
    if (borders.length === 0) return of([]);
    const codes = borders.join(',');
    const url = `${this.baseURL}alpha?codes=${codes}&fields=cca3,name,borders`;
    return this.httpClient.get<Country[]>(url);
  }
}
