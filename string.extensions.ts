/*! *****************************************************************************
string.extensions.ts
Class provides various extension methods for native string object 

Copyright 2017 Zoran Bošnjak (zoran0406@gmail.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

***************************************************************************** */


export { }

/**
 * Internal class used with trimEx, trimStartEx, trimEndEx methods
 *
 */
class TrimHelper {

    // start and end of substring that will be extracted
    private _start: number;
    private _end: number;

    /**
     * Instances a new helper class that will extract substring from source string
     *
     * @param string The source string
     * @param trimChars The array of trim chars
     * @param trimType Identifies the trim type (0 = trim start chars, 1 = trim end chars, 2 = trim both)
     */
    constructor(private string: string, private trimChars: string[], private trimType: number) {
        let length = this.string.length - 1;
        let i = 0;

        if (!trimChars || trimChars.length == 0)
            trimChars = [" "];

        if (this.trimType != 1) {
            for (i = 0; i < length; i++) {
                let num = 0;
                let chr = this.string.substr(i, 1);

                while (num < this.trimChars.length && this.trimChars[num] != chr) {
                    num++;
                }
                if (num == this.trimChars.length) {
                    break;
                }
            }
        }
        if (this.trimType != 0) {
            for (length = this.string.length - 1; length >= i; length--) {
                let num1 = 0;
                let chr1 = this.string.substr(length, 1);

                while (num1 < this.trimChars.length && this.trimChars[num1] != chr1) {
                    num1++;
                }
                if (num1 == this.trimChars.length) {
                    break;
                }
            }
        }

        this._start = i;
        this._end = length;

    };

    /**
     * Extracts substring from string using _start and _end private members
     */
    createTrimmedString(): string {

        let num = this._end - this._start + 1;

        if (num == this.string.length) {
            return this.string;
        }
        if (num == 0) {
            return "";
        }

        return this.string.substr(this._start, num);
    }
}

/**
 * Internal class used with format method
 *
 */
class FormatHelper {
    constructor() {
        // Empty constructor for now
    }

    private nullException(parameter: string): void {
        throw new TypeError("Parameter " + parameter + " is null");
    }

    private formatException() {
        throw new TypeError("Input string was not in a correct format");
    }

    private formatObject(formatter: string, object: any): string {

        // TODO
        // implement a way to parse formatter and provide a custom format for native types
        // like decimal, Date and JSON object 

        // Here is a basic way to format number to N decimals
        if (formatter.toLowerCase().startsWith("n") && formatter.length > 1) {

            // Can be N1, n2, n8, ...

            let decimals = Number(formatter.substr(1));
            let arg = Number(object);

            if (!isNaN(decimals) && !isNaN(arg))
                return arg.toFixed(decimals);
        }

        return object.toString();
    }

    formatString(format: string, ...args: any[]): string {


        let num = 0;
        let length = format.length;
        let chr = '\0';

        let result = "";

        while (true) {
            let num1 = num;
            let num2 = num;
            while (num < length) {
                chr = format[num];
                num++;
                if (chr == '}') {
                    if (num >= length || format[num] != '}') {
                        this.formatException();
                    }
                    else {
                        num++;
                    }
                }
                if (chr == '{') {
                    if (num >= length || format[num] != '{') {
                        num--;
                        break;
                    }
                    else {
                        num++;
                    }
                }
                result += chr;
            }
            if (num == length) {
                break;
            }

            let hasErrors = true;

            num++;
            if (num != length) {
                let chr1 = format[num];
                chr = chr1;
                if (chr1 >= '0' && chr <= '9') {
                    hasErrors = false;
                }
            }

            if (hasErrors) this.formatException();

            let num3 = 0;
            do {
                num3 = num3 * 10 + chr.charCodeAt(0) - 48;
                num++;
                if (num == length) {
                    this.formatException();
                }
                chr = format[num];
            }
            while (chr >= '0' && chr <= '9' && num3 < 1000000);
            if (num3 >= args.length) {
                this.formatException();
            }
            while (num < length) {
                let chr2 = format[num];
                chr = chr2;
                if (chr2 != ' ') {
                    break;
                }
                num++;
            }

            let flag = false;
            let num4 = 0;
            if (chr == ',') {
                num++;
                while (num < length && format[num] == ' ') {
                    num++;
                }
                if (num == length) {
                    this.formatException();
                }
                chr = format[num];
                if (chr == '-') {
                    flag = true;
                    num++;
                    if (num == length) {
                        this.formatException();
                    }
                    chr = format[num];
                }
                if (chr < '0' || chr > '9') {
                    this.formatException();
                }
                do {
                    num4 = num4 * 10 + chr.charCodeAt(0) - 48;
                    num++;
                    if (num == length) {
                        this.formatException();
                    }
                    chr = format[num];
                    if (chr < '0' || chr > '9') {
                        break;
                    }
                }
                while (num4 < 1000000);
            }

            while (num < length) {
                let chr3 = format[num];
                chr = chr3;
                if (chr3 != ' ') {
                    break;
                }
                num++;
            }

            let item = args[num3];
            let objectFormatter = null;
            if (chr == ':') {
                num++;
                num1 = num;
                num2 = num;
                while (true) {
                    if (num == length) {
                        this.formatException();
                    }
                    chr = format[num];
                    num++;
                    if (chr == '{') {
                        if (num >= length || format[num] != '{') {
                            this.formatException();
                        }
                        else {
                            num++;
                        }
                    }
                    else if (chr == '}') {
                        if (num >= length || format[num] != '}') {
                            break;
                        }
                        num++;
                    }
                    if (objectFormatter == null) {
                        objectFormatter = "";
                    }
                    objectFormatter += chr;
                }
                num--;
            }
            if (chr != '}') {
                this.formatException();
            }
            num++;
            let str = null;
            let empty = null;

            if (empty == null) {

                // If there is object formatter, format item with specified format (e.g. "n4", "0.00")
                if (objectFormatter)
                    empty = this.formatObject(objectFormatter, item);
                else
                    empty = item.toString();

            }
            if (empty == null) {
                empty = "";
            }

            let length1 = num4 - empty.Length;
            if (!flag && length1 > 0) {
                let emptyString = String.newInstance(' ', length1);
                result += emptyString;
            }
            result += empty;
            if (flag && length1 > 0) {
                let emptyString = String.newInstance(' ', length1);
                result += emptyString;
            }
        }
        return result;

    }
}

declare global {
    interface String {
        /**
         * Checks whether a specific substring exists within this string
         *
         * @param str The string to seek
         */
        contains(str: any, ignoreCase?: boolean): boolean;


        /**
         * Reports the zero-based index of the first occurrence in this instance of any
         * character in a specified array of strings.
         *
         * @param strings The array containing one or more strings to seek
         * @param startIndex The search starting position
         */
        indexOfAny(strings: string[], startIndex?: number): number;

        /**
         * Reports the zero-based index of the last occurrence in this instance of any
         * character in a specified array of strings.
         * 
         * @param strings The array containing one or more strings to seek
         * @param startIndex The search starting position
        */
        lastIndexOfAnyEx(strings: string[], startIndex?: number): number;


        /**
         * Returns a new string in which a specified string is inserted at a specified index
         * position in this instance.
         *
         * @param index The zero-based index position of the insertion
         * @param str The string to insert
         */
        insert(index: number, str: string): string;

        /**
         * Returns a new string in which a specified number of characters in the current
         * instance beginning at a specified position have been deleted.
         *
         * @param index The zero-based position to begin deleting characters
         * @param count The number of characters to delete
         */
        remove(index: number, count?: number): string;

        /**
         * Returns a new string in which a specified number of characters in the current
         * instance beginning at a specified position have been deleted.
         *
         * @param oldValue The zero-based position to begin deleting characters
         * @param newValue The number of characters to delete
         */
        replaceAll(oldValue: string, newValue: string): string;

        /**
         * Split a string into substrings using the specified separator and return them as an array.
         * It removes empty entries from array
         *
         * @param separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned
         * @param limit A value used to limit the number of elements returned in the array
         */
        splitRemove(separator: string | RegExp, limit?: number): string[];

        /**
         * Split a string into substrings using the specified separator and return them as an array.
         * It removes empty entries from array
         *
         * @param separators An array that identifies which strings to use in separating the string
         * @param limit A value used to limit the number of elements returned in the array
         * @param removeEmptyEntries Determines whether empty entries will be removed from array
         */
        splitMultiple(separators: string[], limit?: number, removeEmptyEntries?: boolean): string[];

        /**
         * Split a string into substrings of characters.
         *
         * @param startIndex The starting position of a substring in this instance
         * @param count The length of the substring in this instance
         * @param removeEmptyEntries Determines whether empty entries will be removed from array
         */
        toCharArray(startIndex?: number, count?: number, removeEmptyEntries?: boolean): string[];

        /**
         * Removes all leading and trailing occurrences of a set of characters specified
         * in an array from the current string.
         *
         * @param chars An array of characters to remove
         */
        trimEx(...chars: string[]): string;

        /**
         * Removes all leading occurrences of a set of characters specified
         * in an array from the current string.
         *
         * @param chars An array of characters to remove
         */
        trimStartEx(...chars: string[]): string;

        /**
         * Removes all trailing occurrences of a set of characters specified
         * in an array from the current string.
         *
         * @param chars An array of characters to remove
         */
        trimEndEx(...chars: string[]): string;
    }


    interface StringConstructor {
        /**
         * Compares two specified string objects and returns an integer that indicates
         * their relative position in the sort order.
         *
         * @param str1 The first string to compare
         * @param str2 The second string to compare
         */
        compare(str1: string, str2: string): number;

        /**
         * Concatenates specified objects into one string
         *
         * @param objects The object array to concatenate
         */
        concat<T>(...objects: T[]): string;

        /**
         * Returns a new string with the same value as specified string
         *
         * @param str The string to copy
         */
        copy(str: string): string;

        /**
         * Replaces one or more format items in a specified string with the string representation
         * of a corresponding object in a specified array.
         *
         * @param str A composite format string
         * @param args An object array that contains zero or more objects to format
         * 
         */
        format(str: string, ...args: any[]): string;

        /**
         * Indicates whether the specified string is null or an empty string
         *
         * @param str The string to test
         */
        isNullOrEmpty(str: string): boolean;

        /**
         * Indicates whether a specified string is null, empty, or consists only of white-space
         *
         * @param str The string to test
         */
        isNullOrWhiteSpace(str: string): boolean;


        /**
         * Indicates whether a specified string consists only of characters
         *
         * @param str The string to test
         * @param ignoreBlanks Determines whether blank spaces will be ignored (false by default)
         */
        isAlpha(str: string, ignoreBlanks?: boolean): boolean;

        /**
         * Indicates whether a specified string consists only of digits
         *
         * @param str The string to test
         * @param ignoreBlanks Determines whether blank spaces will be ignored (false by default)
         */
        isNumeric(str: string, ignoreBlanks?: boolean): boolean;

        /**
         * Indicates whether a specified string consists only of characters or digits
         *
         * @param str The string to test
         * @param ignoreBlanks Determines whether blank spaces will be ignored (false by default)
         */
        isAlphaNumeric(str: string, ignoreBlanks?: boolean): boolean;

        /**
        * Concatenates all the elements of a string array, using the specified separator
        * between each element.
        * 
        * @param separator The string to use as a separator. separator is included in the returned string
        * only if value has more than one element.
        * 
        * @param objects An array that contains the elements to concatenate.
        */
        join<T>(separator: string, ...objects: T[]): string;

        /**
        * Initializes a new instance of the string to the value indicated
        * by a specified character repeated a specified number of times.
        * 
        * @param char A Unicode character
        * 
        * @param repeatCount The number of times character occurs.
        */
        newInstance(char: string, repeatCount: number): string;
    }


}


String.prototype.contains = function (str: string, ignoreCase: boolean = false): boolean {
    if (str === null || str === undefined)
        return false;


    if (ignoreCase) {
        let lowerThis: string = this.toLocaleLowerCase();
        let lowerStr: string = str.toLocaleLowerCase();

        return (lowerThis.indexOf(lowerStr.toString()) > -1);
    }
    else
        return (this.indexOf(str.toString()) > -1);
}

String.prototype.indexOfAny = function (strings: string[], startIndex?: number) {

    let hasStartIndex = (startIndex !== null && startIndex !== undefined);

    let bestIndex = -1;

    for (let str of strings) {
        let index: number = this.indexOf(str, startIndex);
        if (index > -1 && (index < bestIndex || bestIndex == -1)) {
            bestIndex = index;
        }
    }

    return bestIndex;
}

String.prototype.lastIndexOfAnyEx = function (strings: string[], startIndex?: number) {


    let hasStartIndex = (startIndex !== null && startIndex !== undefined);
    let index: number = (hasStartIndex) ? startIndex : 0;
    let s: string = this;


    let pos = -1;
    let curPos = s.indexOfAny(strings, index);


    if (curPos == -1)
        return curPos;

    pos = curPos;
    while (index < s.length && curPos > -1) {
        index = curPos + 1;
        curPos = s.indexOfAny(strings, index);

        if (curPos > -1)
            pos = curPos;
    }


    return pos;
}

String.prototype.insert = function (index: number, str: string): string {
    let s: string = this;
    return s.substr(0, index) + str + s.substr(index);
}

String.prototype.remove = function (index: number, count?: number) {

    let s: string = this;
    let c: number = (count == null || count === undefined) ? s.length - index : count;


    let result = s.substr(0, index);
    result += s.substr(index + c);

    return result;
}

String.prototype.replaceAll = function (oldValue: string, newValue: string): string {

    let result: string = this;

    return result.replace(new RegExp(oldValue, 'g'), newValue);
}

String.prototype.splitRemove = function (separator: string | RegExp, limit?: number): string[] {
    let s: string = this;
    let arr = s.split(separator, limit);

    let res: string[] = [];
    arr.forEach(arrItem => {
        if (arrItem.trim().length > 0)
            res.push(arrItem);
    });

    return res;
}

String.prototype.splitMultiple = function (separators: string[], limit?: number, removeEmptyEntries?: boolean): string[] {

    let separatorsList: number[] = [-1];
    let s: string = this;
    let res: string[] = [];

    // Make positions of separators in string
    let i = 0;
    while (i < s.length) {
        let index = s.indexOfAny(separators, i);


        if (index > -1) {
            separatorsList.push(index);
            i = index + 1;
        }
        else {
            i++;
        }
    }

    for (let i = 0; i < separatorsList.length; i++) {

        if (limit && res.length == limit)
            break;

        let pos = separatorsList[i] + 1;
        let len = (i == separatorsList.length - 1) ? s.length - pos : separatorsList[i + 1] - pos;

        let item: string = s.substr(pos, len);
        if (removeEmptyEntries && item.trim().length == 0) {

        }
        else {
            res.push(item);
        }
    }


    return res;
}

String.prototype.toCharArray = function (startIndex?: number, count?: number, removeEmptyEntries?: boolean): string[] {
    let s: string = this;
    if (startIndex) {
        s = s.substr(startIndex, count);
    }

    let res = s.split("");

    if (removeEmptyEntries) {
        let arr2: string[] = [];
        res.forEach(item => {
            if (item.trim().length > 0)
                arr2.push(item);
        });

        return arr2;
    }
    else
        return res;
}

String.prototype.trimEx = function (...chars: string[]): string {

    if (!chars || chars.length == 0)
        chars = [" "];

    return new TrimHelper(this.toString(), chars, 2).createTrimmedString();

}

String.prototype.trimStartEx = function (...chars: string[]): string {

    if (!chars || chars.length == 0)
        chars = [" "];

    return new TrimHelper(this.toString(), chars, 0).createTrimmedString();

}

String.prototype.trimEndEx = function (...chars: string[]): string {

    if (!chars || chars.length == 0)
        chars = [" "];

    return new TrimHelper(this.toString(), chars, 1).createTrimmedString();

}


String.concat = function <T>(...objects: T[]): string {

    return String.join<T>("", ...objects);

}

String.copy = function (str: string): string {

    return str;

}

String.format = function (str: string, ...args: any[]): string {

    let hlp = new FormatHelper();

    return hlp.formatString(str, ...args);

}

String.isNullOrEmpty = function (str: string): boolean {

    return (str === null || str === undefined || str.length == 0);

}

String.isNullOrWhiteSpace = function (str: string): boolean {

    return (str === null || str === undefined || str.trim().length == 0);

}

String.isAlpha = function (str: string, ignoreBlanks: boolean = false): boolean {

    // https://fasforward.com/list-of-european-special-characters/
    let latinSpecialChars: string =
        "¡¿ÄäÀàÁáÂâÃãÅåǍǎĄąĂ" +
        "ăÆæĀāÇçĆćĈĉČčĎđĐďðÈ" +
        "èÉéÊêËëĚěĘęĖėĒēĜĝĢģ" +
        "ĞğĤĥÌìÍíÎîÏïıĪīĮįĴĵ" +
        "ĶķĹĺĻļŁłĽľÑñŃńŇňŅņÖ" +
        "öÒòÓóÔôÕõŐőØøŒœŔŕŘř" +
        "ẞßŚśŜŝŞşŠšȘșŤťŢţÞþȚ" +
        "țÜüÙùÚúÛûŰűŨũŲųŮůŪū" +
        "ŴŵÝýŸÿŶŷŹźŽžŻż";


    for (let i = 0; i < str.length; i++) {
        let ch: string = str.substr(i, 1);
        let isBlank: boolean = String.isNullOrWhiteSpace(ch);

        if (isBlank && !ignoreBlanks)
            return false;

        // If there is no difference when converting case, there is high probability of non letter character
        if (!isBlank && (ch.toLocaleLowerCase() == ch.toLocaleUpperCase())) {

            // Check again for special characters
            // If character is not special character, it is not a letter
            if (!latinSpecialChars.contains(ch))
                return false;
        }
    }

    return true;

}

String.isNumeric = function (str: string, ignoreBlanks: boolean = false): boolean {

    for (let i = 0; i < str.length; i++) {
        let ch: string = str.substr(i, 1);
        let isBlank: boolean = String.isNullOrWhiteSpace(ch);

        if (isBlank && !ignoreBlanks)
            return false;

        if (!isBlank && (ch < '0' || ch > '9')) {

            return false;
        }
    }

    return true;
}

String.isAlphaNumeric = function (str: string, ignoreBlanks: boolean = false): boolean {
    for (let i = 0; i < str.length; i++) {

        let ch: string = str.substr(i, 1);

        if (!String.isAlpha(ch, ignoreBlanks) && !String.isNumeric(ch, ignoreBlanks))
            return false;
    }

    return true;
}

String.join = function <T>(separator: string, ...objects: T[]): string {
    let result: string = "";

    let index: number = 1;

    for (let s of objects) {

        result += s.toString();
        if (index < objects.length)
            result += separator;

        index++;
    }

    return result;
}

String.newInstance = function (char: string, repeatCount: number): string {
    let result: string = "";

    for (var i = 0; i < repeatCount; i++)
        result += char;

    return result;
}

String.compare = function (str1: string, str2: string): number {
    return str1.localeCompare(str2);
}
