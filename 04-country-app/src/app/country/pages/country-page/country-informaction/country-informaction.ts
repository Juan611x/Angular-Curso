import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Country } from '../../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-country-informaction',
  imports: [DecimalPipe],
  templateUrl: './country-informaction.html',
  styleUrl: './country-informaction.css',
})
export class CountryInformaction {
  country = input.required<Country>();

  currentYear = computed(() => {
    return new Date().getFullYear();
  });
}
