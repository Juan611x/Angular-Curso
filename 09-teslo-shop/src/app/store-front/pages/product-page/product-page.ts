import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@productos/services/products.service';
import { firstValueFrom } from 'rxjs';
import { ProductCarousel } from "@productos/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productResource = resource({
    params: () => ({ slug: this.productIdSlug }),
    loader: async ({ params }) => {
      return await firstValueFrom(this.productService.gerProductBySlug(params.slug));
    },
  });
}
