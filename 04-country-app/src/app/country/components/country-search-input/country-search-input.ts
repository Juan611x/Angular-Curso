import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'app-country-search-input',
  imports: [],
  templateUrl: './country-search-input.html',
  styleUrl: './country-search-input.css',
})
export class CountrySearchInput {
  placeHolderText = input.required<string>();
  debounceTime = input<number>(300);
  initialValue = input<string>('');

  searchValue = output<string>();

  inputValue = linkedSignal<string>(() => this.initialValue());

  handleSearchCapital(value: string) {
    this.searchValue.emit(value);
  }

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.handleSearchCapital(value);
    }, this.debounceTime());
    onCleanup(() => clearTimeout(timeout));
  });
}
