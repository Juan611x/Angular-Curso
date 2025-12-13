import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountrySeviceService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './country-page.html',
  styleUrl: './country-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryPage {
  private fb = inject(FormBuilder);
  countryService = inject(CountrySeviceService);

  regions = signal(this.countryService.regions);
  countries = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]],
  });

  onFormChange = effect((onCleanUp) => {
    const regionSuscription = this.onRegionChange();
    const countrySuscription = this.onCountryChange();
    onCleanUp(() => {
      regionSuscription.unsubscribe();
      countrySuscription.unsubscribe();
    });
  });

  onRegionChange() {
    return this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => {
          //Limpiar campos dependientes
          this.myForm.get('country')!.reset('');
          this.countries.set([]);
          this.myForm.get('border')!.reset('');
          this.borders.set([]);
        }),
        switchMap((region) => this.countryService.getCountriesByRegion(region!)) //Regresa un observable
      )
      .subscribe((countries) => {
        this.countries.set(countries);
      });
  }

  onCountryChange() {
    return this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => {
          //Limpiar campos dependientes
          this.myForm.get('border')!.reset('');
          this.borders.set([]);
        }),
        filter((value) => value!.length > 0),
        switchMap((code) => this.countryService.getCountryByCode(code!))
      )
      .subscribe((country) => {
        const borders = country?.borders || [];
        console.log(borders);
        this.countryService.getCountryBordesByCodes(borders).subscribe((countries) => {
          this.borders.set(countries);
        });
      });
  }
}
