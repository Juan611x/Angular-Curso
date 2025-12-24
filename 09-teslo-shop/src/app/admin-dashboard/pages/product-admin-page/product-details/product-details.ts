import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ProductCarousel } from '@productos/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { Product } from '@productos/interfaces/product-response.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();

  productsService = inject(ProductsService);
  private router = inject(Router);

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern('^(men|women|kid|unisex)$')]],
  });

  wasSaved = signal(false);
  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  imagesToCarousel = computed(() => [...(this.product().images ?? []), ...this.tempImages()]);

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes || [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) || [],
    };

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigateByUrl(`/admin/product/${product.slug}`);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }

  onFilesChanged(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    this.imageFileList = files || undefined;

    const imageUrls = Array.from(files || []).map((file) => URL.createObjectURL(file));
    this.tempImages.set(imageUrls);
  }
}
