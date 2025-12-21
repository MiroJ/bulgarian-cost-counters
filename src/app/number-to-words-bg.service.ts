import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NumberToWordsBgService {
    private ones = ['', 'един', 'два', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'];
    private onesF = ['', 'една', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'];
    private teens = ['десет', 'единадесет', 'дванадесет', 'тринадесет', 'четиринадесет', 'петнадесет', 'шестнадесет', 'седемнадесет', 'осемнадесет', 'деветнадесет'];
    private tens = ['', '', 'двадесет', 'тридесет', 'четиридесет', 'петдесет', 'шестдесет', 'седемдесет', 'осемдесет', 'деветдесет'];
    private hundreds = ['', 'сто', 'двеста', 'триста', 'четиристотин', 'петстотин', 'шестстотин', 'седемстотин', 'осемстотин', 'деветстотин'];

    /**
     * Converts a number to Bulgarian words
     * @param num The number to convert (supports up to trillions)
     * @param feminine Use feminine form for 1 and 2 (default: true for currency "лева")
     * @returns The number in Bulgarian words
     */
    convertToWords(num: number, feminine: boolean = true): string {
        if (num === 0) return 'нула';
        if (num < 0) return 'минус ' + this.convertToWords(Math.abs(num), feminine);

        // Round to avoid floating point issues
        num = Math.round(num);

        const trillion = Math.floor(num / 1000000000000);
        const billion = Math.floor((num % 1000000000000) / 1000000000);
        const million = Math.floor((num % 1000000000) / 1000000);
        const thousand = Math.floor((num % 1000000) / 1000);
        const remainder = Math.floor(num % 1000);

        let result = '';

        if (trillion > 0) {
            result += this.convertHundreds(trillion, false) + ' ' + this.pluralize(trillion, 'трилион', 'трилиона', 'трилиона');
        }

        if (billion > 0) {
            if (result) result += ' ';
            result += this.convertHundreds(billion, false) + ' ' + this.pluralize(billion, 'милиард', 'милиарда', 'милиарда');
        }

        if (million > 0) {
            if (result) result += ' ';
            result += this.convertHundreds(million, false) + ' ' + this.pluralize(million, 'милион', 'милиона', 'милиона');
        }

        if (thousand > 0) {
            if (result) result += ' ';
            if (thousand === 1) {
                result += 'хиляда';
            } else {
                result += this.convertHundreds(thousand, false) + ' ' + this.pluralize(thousand, 'хиляда', 'хиляди', 'хиляди');
            }
        }

        if (remainder > 0) {
            if (result) result += ' ';
            result += this.convertHundreds(remainder, feminine && !trillion && !billion && !million && !thousand);
        }

        return result.trim();
    }

    /**
     * Converts a number with currency to Bulgarian words
     * @param num The number to convert
     * @param currency The currency name (e.g., "лева", "евро")
     * @returns The number with currency in Bulgarian words
     */
    convertWithCurrency(num: number, currency: string = 'лева'): string {
        const integerPart = Math.floor(num);
        const decimalPart = Math.round((num - integerPart) * 100);

        let result = this.convertToWords(integerPart, currency === 'лева');
        result += ' ' + this.getCurrencyForm(integerPart, currency);

        if (decimalPart > 0) {
            const decimalCurrency = this.getDecimalCurrency(currency);
            result += ' и ' + this.convertToWords(decimalPart, false);
            result += ' ' + this.getCurrencyForm(decimalPart, decimalCurrency);
        }

        return result;
    }

    private convertHundreds(num: number, feminine: boolean): string {
        if (num === 0) return '';

        const hundred = Math.floor(num / 100);
        const ten = Math.floor((num % 100) / 10);
        const one = num % 10;

        let result = '';

        if (hundred > 0) {
            result += this.hundreds[hundred];
        }

        if (ten === 1) {
            if (result) result += ' ';
            result += this.teens[one];
        } else {
            if (ten > 1) {
                if (result) result += ' ';
                result += this.tens[ten];
            }
            if (one > 0) {
                if (result) result += ' ';
                result += feminine ? this.onesF[one] : this.ones[one];
            }
        }

        return result;
    }

    private pluralize(num: number, one: string, few: string, many: string): string {
        if (num === 1) return one;
        if (num % 10 === 1 && num % 100 !== 11) return one;
        return many;
    }

    private getCurrencyForm(num: number, currency: string): string {
        if (currency === 'лева') {
            if (num === 1) return 'лев';
            if (num % 10 === 1 && num % 100 !== 11) return 'лев';
            return 'лева';
        } else if (currency === 'евро') {
            return 'евро';
        } else if (currency === 'стотинки') {
            if (num === 1) return 'стотинка';
            if (num % 10 === 1 && num % 100 !== 11) return 'стотинка';
            return 'стотинки';
        } else if (currency === 'цента') {
            if (num === 1) return 'цент';
            if (num % 10 === 1 && num % 100 !== 11) return 'цент';
            return 'цента';
        }
        return currency;
    }

    private getDecimalCurrency(currency: string): string {
        if (currency === 'лева') return 'стотинки';
        if (currency === 'евро') return 'цента';
        return 'части';
    }
}
