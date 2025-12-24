import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { Card } from '@productos/components/card/card';
import { ProductsService } from '@productos/services/products.service';
import { firstValueFrom, map } from 'rxjs';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [Card, Pagination],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  currentPage = this.paginationService.currentPage;

  productResource = resource({
    params: () => ({ page: this.currentPage() - 1 }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.productsService.getProducts({
          offset: params.page * 9,
        })
      );
    },
  });
}
