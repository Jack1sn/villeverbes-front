import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transLetras',  // Mudando o nome do pipe para 'transLetras' para seguir o padrão camelCase
  standalone: true
})
export class TransLetrasPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .replace(/[^a-záàâãäéèêëíìîïóòôõöúùûüçñ´]/gi, '');
  }
}
