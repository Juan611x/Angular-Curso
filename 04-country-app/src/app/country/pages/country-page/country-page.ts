import { Component, inject, resource } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { NotFound } from "../../../shared/components/not-found/not-found";
import { CountryInformaction } from "./country-informaction/country-informaction";

@Component({
  selector: 'app-country-page',
  imports: [NotFound, CountryInformaction],
  templateUrl: './country-page.html',
  styleUrl: './country-page.css',
})
export class CountryPage {
  countryCode = inject(ActivatedRoute).snapshot.params['code']; //No es reactivo es estático
  countryService = inject(CountryService);

  countryResource = resource({
    params: () => ({ code: this.countryCode }),
    loader: async ({ params }) => {
      return firstValueFrom(this.countryService.searchCountryByAlphaCode(params.code));
    },
  });
}
