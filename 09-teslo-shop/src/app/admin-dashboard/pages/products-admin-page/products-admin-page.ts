import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { ProductTable } from '@productos/components/product-table/product-table';
import { Product } from '../../../products/interfaces/product-response.interface';
import { ProductsService } from '../../../products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { firstValueFrom } from 'rxjs';
import { Pagination } from '@shared/components/pagination/pagination';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
  styleUrl: './products-admin-page.css',
})
export class ProductsAdminPage {
  private productsService = inject(ProductsService);

  paginationService = inject(PaginationService);
  currentPage = this.paginationService.currentPage;

  productsPerPage = signal(10);

  productResource = resource({
    params: () => ({ page: this.currentPage() - 1, limit: this.productsPerPage() }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.productsService.getProducts({
          offset: params.page * params.limit,
          limit: params.limit,
        })
      );
    },
  });
}
