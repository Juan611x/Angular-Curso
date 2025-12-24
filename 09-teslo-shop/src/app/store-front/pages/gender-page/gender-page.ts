import { Component, inject, resource } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map } from 'rxjs';
import { ProductsService } from '@productos/services/products.service';
import { Card } from '@productos/components/card/card';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from "@shared/components/pagination/pagination";

@Component({
  selector: 'app-gender-page',
  imports: [Card, Pagination],
  templateUrl: './gender-page.html',
  styleUrl: './gender-page.css',
})
export class GenderPage {
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  gender = toSignal(this.route.params.pipe(map((params) => params['gender'])));
  currentPage = this.paginationService.currentPage;

  productResource = resource({
    params: () => ({ gender: this.gender(), page: this.currentPage() - 1 }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.productsService.getProducts({ gender: params.gender, offset: params.page * 9 })
      );
    },
  });
}
