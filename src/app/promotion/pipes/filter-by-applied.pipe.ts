import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByApplied',
  standalone: true
})
export class FilterByAppliedPipe implements PipeTransform {

  transform(items: any[] | null | undefined): any[] {
    if (!items) {
      return [];
    }
    return items.filter(item => item.AppliedDate && item.AppliedDate !== null);
  }

}
