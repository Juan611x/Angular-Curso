import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleCase',
})
export class ToggleCasePipe implements PipeTransform {
  transform(value: string, upper: boolean = true): any {
    return upper ? value.toUpperCase() : value.toLowerCase();
  }
}
