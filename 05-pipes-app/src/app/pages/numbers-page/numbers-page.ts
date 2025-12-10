import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-numbers-page',
  imports: [DecimalPipe, PercentPipe, CurrencyPipe],
  templateUrl: './numbers-page.html',
  styleUrl: './numbers-page.css',
})
export default class NumbersPage {
  totalSales = signal(2_433_232.5567);
  percentage = signal(0.4856);
}
