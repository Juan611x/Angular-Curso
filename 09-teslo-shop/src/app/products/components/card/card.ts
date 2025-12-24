import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@productos/interfaces/product-response.interface';
import { ProductImagePipe } from '../../pipes/product-image.pipe';

@Component({
  selector: 'app-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  product = input.required<Product>();
}
