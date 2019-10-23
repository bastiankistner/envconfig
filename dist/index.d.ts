export declare enum Type {
    NUMBER = "number",
    STRING = "string",
    ARRAY = "array",
    BOOLEAN = "boolean",
    JSON = "json"
}
declare type FromType = {
    number: number;
    string: string;
    array: string[];
    boolean: boolean;
    json: object;
    [key: string]: any;
};
export declare type Sanitizer = (value: any) => any;
declare type IDetailedSpecification = {
    type?: Type;
    name?: string;
    isOptional?: boolean;
    default?: any;
    sanitize?: Sanitizer;
};
export interface Specification {
    [key: string]: IDetailedSpecification | Type | null;
}
export declare type Config = {
    [key: string]: any;
};
declare type ExtractConfigType<T> = T extends {
    isOptional: true;
    sanitize: (...args: any[]) => infer U;
    [key: string]: any;
} ? U | undefined : T extends {
    isOptional?: false | undefined;
    sanitize: (...args: any[]) => infer U;
    [key: string]: any;
} ? U : T extends {
    isOptional: true | undefined;
    type: Type;
    [key: string]: any;
} ? FromType[T['type']] | undefined : T extends {
    isOptional?: false | undefined;
    type: Type;
    [key: string]: any;
} ? FromType[T['type']] : T extends {
    isOptional: true;
    [key: string]: any;
} ? string | undefined : T extends string ? FromType[T] : string;
export declare const describe: <T extends Specification>(specification: T, input?: {
    [key: string]: any;
} | null, defaults?: {
    [key: string]: any;
} | undefined) => { [Key in keyof T]: ExtractConfigType<T[Key]>; };
export {};
