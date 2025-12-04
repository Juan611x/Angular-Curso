import { Component, inject, linkedSignal, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { CountrySearchInput } from '../../components/country-search-input/country-search-input';
import { CountryList } from '../../components/country-list/country-list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [CountrySearchInput, CountryList],
  templateUrl: './by-country-page.html',
  styleUrl: './by-country-page.css',
})
export class ByCountryPage {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') || '';
  router = inject(Router);

  query = linkedSignal<string>(() => this.queryParam);

  onSearchCountry = (value: string) => {
    this.query.set(value);
  };

  countryResource = resource({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      this.router.navigate(['/country/by-country'], {
        queryParams: { query: params.query },
      });
      if (params.query === '') return [];
      return await firstValueFrom(this.countryService.searchByCountry(params.query));
    },
  });
}
