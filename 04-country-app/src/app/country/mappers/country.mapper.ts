import { Country } from '../interfaces/country.interface';
import { RESTCountry } from '../interfaces/res-countries';

export class CountryMapper {
  static RESTCountryToCountry(restCountry: RESTCountry): Country {
    return {
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSVG: restCountry.flags.svg,
      name: restCountry.name.common,
      capital: restCountry.capital ? restCountry.capital[0] : 'N/A',
      population: restCountry.population,
      region: restCountry.region,
      subRegion: restCountry.subregion,
    };
  }

  static RESTCountriesToCountries(restCountries: RESTCountry[]): Country[] {
    return restCountries.map(this.RESTCountryToCountry);
  }
}
