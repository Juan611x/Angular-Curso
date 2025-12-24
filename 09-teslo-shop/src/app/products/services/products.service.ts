import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@productos/interfaces/product-response.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '@auth/interfaces/user.interface';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((response) => console.log(response)),
        tap((response) => this.productsCache.set(key, response))
      );
  }

  gerProductBySlug(slug: string) {
    if (this.productCache.has(slug)) {
      return of(this.productCache.get(slug)!);
    }

    return this.http.get<Product>(`${BASE_URL}/products/${slug}`).pipe(
      tap((response) => console.log(response)),
      tap((response) => this.productCache.set(slug, response))
    );
  }
  getProductById(id: string) {
    if (id === 'new') {
      return of(emptyProduct);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${BASE_URL}/products/${id}`).pipe(
      tap((response) => console.log(response)),
      tap((response) => this.productCache.set(id, response))
    );
  }

  private updateProductCache(product: Product) {
    const id = product.id;
    this.productCache.set(id, product);
    this.productCache.set(product.slug, product);

    this.productsCache.forEach((productsResponse, key) => {
      productsResponse.products = productsResponse.products.map((currentProduct) => {
        return currentProduct.id === id ? product : currentProduct;
      });
    });
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    return this.uploadImages(imageFileList).pipe(
      map((imageFilenames) => ({
        ...productLike,
        images: [...(productLike.images ?? []), ...imageFilenames],
      })),
      switchMap((productWithImages) =>
        this.http.patch<Product>(`${BASE_URL}/products/${id}`, productWithImages)
      ),
      tap((response) => this.updateProductCache(response))
    );

    // return this.http
    //   .patch<Product>(`${BASE_URL}/products/${id}`, productLike)
    //   .pipe(tap((response) => this.updateProductCache(response)));
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.uploadImages(imageFileList).pipe(
      map((imageFilenames) => ({
        ...productLike,
        images: [...(productLike.images ?? []), ...imageFilenames],
      })),
      switchMap((productWithImages) =>
        this.http.post<Product>(`${BASE_URL}/products`, productWithImages)
      ),
      tap((response) => this.updateProductCache(response))
    );
    // return this.http
    //   .post<Product>(`${BASE_URL}/products`, productLike)
    //   .pipe(tap((response) => this.updateProductCache(response)));
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((image) => this.uploadImage(image));

    return forkJoin(uploadObservables); //ejecuta un arreglo de observables y devuelve un observable con un arreglo con los resultados de cada uno
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);

    return this.http
      .post<{ fileName: string }>(`${BASE_URL}/files/product`, formData)
      .pipe(map((response) => response.fileName));
  }
}
