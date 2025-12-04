import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { Region } from '../../interfaces/region.type';
import { CountryList } from '../../components/country-list/country-list';
import { CountryService } from '../../services/country.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

export function parseRegion(input: string): Region {
  input = input.toLowerCase().trim();
  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegions[input] || 'Americas';
}

@Component({
  selector: 'app-by-region-page',
  imports: [CountryList],
  templateUrl: './by-region-page.html',
  styleUrl: './by-region-page.css',
})
export class ByRegionPage {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') || '';
  router = inject(Router);

  public regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];
  selectedRegion = linkedSignal<Region | null>(() => parseRegion(this.queryParam));

  selectRegion(region: Region) {
    this.selectedRegion.set(region);
    this.router.navigate(['/country/by-region'], {
      queryParams: { query: region },
    });
  }

  countryResource = resource({
    params: () => ({ region: this.selectedRegion() }),
    loader: async ({ params }) => {
      if (!params.region) return [];
      return await firstValueFrom(this.countryService.searchByRegion(params.region));
    },
  });
}
