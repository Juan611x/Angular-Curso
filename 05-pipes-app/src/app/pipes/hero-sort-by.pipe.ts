import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroSortBy',
})
export class HeroSortByPipe implements PipeTransform {
  transform(value: Hero[], sortBy: keyof Hero | null): Hero[] {
    if(!sortBy) return value;
    return value.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
  }
}
