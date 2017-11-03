# TypeScript-Helpers
Various methods and extension methods that work with TypeScript (and Angular)
Methods include "format", split with multiple characters, 3 types of trim with different set of characters as blank, and many more

Methods on string instance:

contains(str: any, ignoreCase?: boolean): boolean;<br/>
indexOfAny(strings: string[], startIndex?: number): number;<br/>
lastIndexOfAnyEx(strings: string[], startIndex?: number): number;<br/>
insert(index: number, str: string): string;<br/>
remove(index: number, count?: number): string; <br/>
replaceAll(oldValue: string, newValue: string): string;<br/>
splitRemove(separator: string | RegExp, limit?: number): string[];<br/>
splitMultiple(separators: string[], limit?: number, removeEmptyEntries?: boolean): string[];<br/>
toCharArray(startIndex?: number, count?: number, removeEmptyEntries?: boolean): string[];<br/>
trimEx(...chars: string[]): string;<br/>
trimStartEx(...chars: string[]): string;<br/>
trimEndEx(...chars: string[]): string;<br/>


Methods on string class:<br/>

compare(str1: string, str2: string): number;<br/>
concat<T>(...objects: T[]): string;<br/>
copy(str: string): string;<br/>
format(str: string, ...args: any[]): string;<br/>
isNullOrEmpty(str: string): boolean;<br/>
isNullOrWhiteSpace(str: string): boolean;<br/>
isAlpha(str: string, ignoreBlanks?: boolean): boolean;<br/>
isNumeric(str: string, ignoreBlanks?: boolean): boolean;<br/>
isAlphaNumeric(str: string, ignoreBlanks?: boolean): boolean;<br/>
join<T>(separator: string, ...objects: T[]): string;<br/>
newInstance(char: string, repeatCount: number): string;<br/>
