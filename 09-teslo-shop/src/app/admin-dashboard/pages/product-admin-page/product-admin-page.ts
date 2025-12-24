import { Component, effect, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@productos/services/products.service';
import { firstValueFrom, map, tap } from 'rxjs';
import { ProductDetails } from "./product-details/product-details";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
  styleUrl: './product-admin-page.css',
})
export class ProductAdminPage {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);
  router = inject(Router);

  productId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map((params) => params.get('id'))
      // tap((id) => {
      //   console.log(id);
      // })
    )
  );

  productResource = resource({
    params: () => ({
      Id: this.productId(),
    }),
    loader: async ({ params }) => {
      return await firstValueFrom(this.productService.getProductById(params.Id!));
    },
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigateByUrl('/admin/products');
    }
  });
}
