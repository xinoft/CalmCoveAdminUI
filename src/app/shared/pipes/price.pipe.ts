import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true
})
export class PricePipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return 'AED 0';
    }
    return `AED ${value.toFixed(2)}`;
  }

}