import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@productos/interfaces/product-response.interface';
import { ProductImagePipe } from '@productos/pipes/product-image.pipe';

@Component({
  selector: 'app-product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
})
export class ProductTable {
  products = input.required<Product[]>();
}
