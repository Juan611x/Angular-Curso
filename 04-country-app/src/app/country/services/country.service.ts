import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/res-countries';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

const APU_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private httpClient = inject(HttpClient);

  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.trim().toLowerCase();
    console.log(query);

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query)!);
    }

    return this.httpClient.get<RESTCountry[]>(`${APU_URL}/capital/${query}`).pipe(
      map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
      // delay(3000),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Error searching countries by capital'));
      })
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.trim().toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query)!);
    }

    return this.httpClient.get<RESTCountry[]>(`${APU_URL}/name/${query}`).pipe(
      map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
      // delay(3000),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Error searching countries by name'));
      })
    );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region)!);
    }

    return this.httpClient.get<RESTCountry[]>(`${APU_URL}/region/${region}`).pipe(
      map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
      // delay(3000),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Error searching countries by name'));
      })
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | undefined> {
    return this.httpClient.get<RESTCountry[]>(`${APU_URL}/alpha/${code}`).pipe(
      map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
      // delay(3000),
      map((countries) => countries.at(0)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(`Error searching countries by code ${code}`));
      })
    );
  }
}
