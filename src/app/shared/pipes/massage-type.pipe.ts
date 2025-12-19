import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'massageType',
  standalone: true
})
export class MassageTypePipe implements PipeTransform {

  private typeMappings: { [key: number]: string } = {
    1: 'Calm Cove Signature Massages',
    2: 'Calm Cove Premium Massages',
    3: 'Calm Cove Experiences Massages',
  };

  transform(value: number): string {
    return this.typeMappings[value] || 'Unknown';
  }

}