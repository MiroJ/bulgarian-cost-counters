import { Pipe, PipeTransform } from '@angular/core';
import { NumberToWordsBgService } from './number-to-words-bg.service';

@Pipe({
    name: 'numberToWordsBg',
    standalone: true
})
export class NumberToWordsBgPipe implements PipeTransform {
    constructor(private numberToWordsService: NumberToWordsBgService) {}

    transform(value: number, currency?: string): string {
        if (value == null || isNaN(value)) return '';
        
        if (currency) {
            return this.numberToWordsService.convertWithCurrency(value, currency);
        }
        
        return this.numberToWordsService.convertToWords(value);
    }
}
