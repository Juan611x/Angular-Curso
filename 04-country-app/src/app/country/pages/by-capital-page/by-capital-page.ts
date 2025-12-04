import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { CountrySearchInput } from '../../components/country-search-input/country-search-input';
import { CountryList } from '../../components/country-list/country-list';
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  imports: [CountrySearchInput, CountryList],
  templateUrl: './by-capital-page.html',
  styleUrl: './by-capital-page.css',
})
export class ByCapitalPage {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') || '';
  router = inject(Router);

  query = linkedSignal<string>(() => this.queryParam);

  onSearchCapital = (value: string) => {
    this.query.set(value);
  };

  countryResource = resource({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      this.router.navigate(['/country/by-capital'], {
        queryParams: { query: params.query },
      });
      if (params.query === '') return [];
      return await firstValueFrom(this.countryService.searchByCapital(params.query));
    },
  });

  // isLoading = signal(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearchCapital(value: string): void {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   // console.log(value);
  //   this.countryService.searchByCapital(value).subscribe({
  //     next: (countries) => {
  //       // console.log(countries);
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false);
  //       this.isError.set(`An error occurred while searching for countries with capital "${value}"`);
  //       this.countries.set([]);
  //     },
  //   });
  // }
}
