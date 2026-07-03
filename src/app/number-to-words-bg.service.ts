import { Injectable } from '@angular/core';

type Gender = 'm' | 'f' | 'n';

@Injectable({
    providedIn: 'root'
})
export class NumberToWordsBgService {
    // Only 1 and 2 change with grammatical gender; 3-9 are invariant.
    private ones = ['', 'един', 'два', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'];
    private onesF = ['', 'една', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'];
    private onesN = ['', 'едно', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'];
    private teens = ['десет', 'единадесет', 'дванадесет', 'тринадесет', 'четиринадесет', 'петнадесет', 'шестнадесет', 'седемнадесет', 'осемнадесет', 'деветнадесет'];
    private tens = ['', '', 'двадесет', 'тридесет', 'четиридесет', 'петдесет', 'шестдесет', 'седемдесет', 'осемдесет', 'деветдесет'];
    private hundreds = ['', 'сто', 'двеста', 'триста', 'четиристотин', 'петстотин', 'шестстотин', 'седемстотин', 'осемстотин', 'деветстотин'];

    /**
     * Converts a number to Bulgarian words
     * @param num The number to convert (supports up to trillions)
     * @param gender Grammatical gender for 1 and 2 ('m' един/два, 'f' една/две, 'n' едно/две)
     * @returns The number in Bulgarian words
     */
    convertToWords(num: number, gender: Gender = 'm'): string {
        if (num === 0) return 'нула';
        if (num < 0) return 'минус ' + this.convertToWords(Math.abs(num), gender);

        // Round to avoid floating point issues
        num = Math.round(num);

        const trillion = Math.floor(num / 1000000000000);
        const billion = Math.floor((num % 1000000000000) / 1000000000);
        const million = Math.floor((num % 1000000000) / 1000000);
        const thousand = Math.floor((num % 1000000) / 1000);
        const remainder = Math.floor(num % 1000);

        // Магнитудите милион/милиард/трилион са от мъжки род, хиляда - от женски.
        const groups: string[] = [];

        if (trillion > 0) {
            groups.push(this.convertHundreds(trillion, 'm') + ' ' + this.magnitudeForm(trillion, 'трилион', 'трилиона'));
        }
        if (billion > 0) {
            groups.push(this.convertHundreds(billion, 'm') + ' ' + this.magnitudeForm(billion, 'милиард', 'милиарда'));
        }
        if (million > 0) {
            groups.push(this.convertHundreds(million, 'm') + ' ' + this.magnitudeForm(million, 'милион', 'милиона'));
        }
        if (thousand > 0) {
            if (thousand === 1) {
                groups.push('хиляда');
            } else {
                groups.push(this.convertHundreds(thousand, 'f') + ' ' + this.pluralize(thousand, 'хиляда', 'хиляди'));
            }
        }
        if (remainder > 0) {
            groups.push(this.convertHundreds(remainder, gender));
        }

        // Съюзът "и" стои пред последната част на числото (освен ако тя вече
        // не съдържа вътрешно "и", напр. "двадесет и пет").
        let result = groups[0] ?? '';
        for (let i = 1; i < groups.length; i++) {
            const g = groups[i];
            const isLast = i === groups.length - 1;
            result += (isLast && !g.includes(' и ')) ? ' и ' : ' ';
            result += g;
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
        currency = currency.trim();

        let integerPart = Math.floor(num);
        let decimalPart = Math.round((num - integerPart) * 100);
        // Закръгляне нагоре: 1.999 -> 2.00, а не "и сто стотинки".
        if (decimalPart === 100) {
            integerPart += 1;
            decimalPart = 0;
        }

        let result = this.convertToWords(integerPart, this.genderFor(currency));
        result += ' ' + this.getCurrencyForm(integerPart, currency);

        if (decimalPart > 0) {
            const decimalCurrency = this.getDecimalCurrency(currency);
            result += ' и ' + this.convertToWords(decimalPart, this.genderFor(decimalCurrency));
            result += ' ' + this.getCurrencyForm(decimalPart, decimalCurrency);
        }

        return result;
    }

    private convertHundreds(num: number, gender: Gender): string {
        if (num === 0) return '';

        const hundred = Math.floor(num / 100);
        const ten = Math.floor((num % 100) / 10);
        const one = num % 10;

        const hundredWord = hundred > 0 ? this.hundreds[hundred] : '';

        let tail = '';
        if (ten === 1) {
            tail = this.teens[one];
        } else if (ten > 1 && one > 0) {
            tail = this.tens[ten] + ' и ' + this.oneWord(one, gender);
        } else if (ten > 1) {
            tail = this.tens[ten];
        } else if (one > 0) {
            tail = this.oneWord(one, gender);
        }

        if (hundredWord && tail) {
            // "сто и пет", "сто и двадесет", но "сто двадесет и пет".
            const tailIsSingleWord = !(ten > 1 && one > 0);
            return tailIsSingleWord ? hundredWord + ' и ' + tail : hundredWord + ' ' + tail;
        }
        return hundredWord || tail;
    }

    private oneWord(digit: number, gender: Gender): string {
        if (gender === 'f') return this.onesF[digit];
        if (gender === 'n') return this.onesN[digit];
        return this.ones[digit];
    }

    private pluralize(num: number, singular: string, plural: string): string {
        // За "хиляда": след съставно число, завършващо на едно (21, 101...),
        // се употребява единствено число - "двадесет и една хиляда".
        if (num % 10 === 1 && num % 100 !== 11) return singular;
        return plural;
    }

    private magnitudeForm(num: number, singular: string, plural: string): string {
        // За милион/милиард/трилион единствено число има само точно при 1
        // (един милион), а всяко съставно число е в множествено -
        // "тридесет и един милиона".
        return num === 1 ? singular : plural;
    }

    private genderFor(currency: string): Gender {
        switch (currency) {
            case 'лева':
            case 'лев':
            case 'цента':
            case 'цент':
                return 'm';
            case 'стотинки':
            case 'стотинка':
                return 'f';
            case 'евро':
                return 'n';
            default:
                return 'm';
        }
    }

    private getCurrencyForm(num: number, currency: string): string {
        const singular = num % 10 === 1 && num % 100 !== 11;
        if (currency === 'лева') {
            return singular ? 'лев' : 'лева';
        } else if (currency === 'евро') {
            return 'евро';
        } else if (currency === 'стотинки') {
            return singular ? 'стотинка' : 'стотинки';
        } else if (currency === 'цента') {
            return singular ? 'цент' : 'цента';
        }
        return currency;
    }

    private getDecimalCurrency(currency: string): string {
        if (currency === 'лева') return 'стотинки';
        if (currency === 'евро') return 'цента';
        return 'части';
    }
}
