import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const IMAGE_BASE_URL = environment.imageUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): any {
    if (value === null) {
      return './assets/images/place-holder.jpg';
    }
    
    if (Array.isArray(value)) {
      return value.length > 0 ? `${IMAGE_BASE_URL}${value[0]}` : './assets/images/place-holder.jpg';
    }

    if(typeof value === 'string' && value.startsWith('blob:')){
      return value;
    }
    
    return `${IMAGE_BASE_URL}${value}`;
  }
}
