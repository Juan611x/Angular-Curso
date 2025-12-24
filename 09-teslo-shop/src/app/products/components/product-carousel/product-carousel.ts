import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  viewChild,
  effect,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ProductImagePipe } from '@productos/pipes/product-image.pipe';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles

@Component({
  selector: 'app-product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styleUrl: './product-carousel.css',
})
export class ProductCarousel implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper | undefined = undefined;

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) return;

    this.swiper?.destroy(true, true);
    const paginationElement = this.swiperDiv().nativeElement.querySelector('.swiper-pagination');
    paginationElement.innerHTML = '';

    setTimeout(() => {}, 100);
    this.swiperInit();
  }
}
