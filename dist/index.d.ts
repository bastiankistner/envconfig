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
interface IDetailedSpecification {
    type?: Type;
    name?: string;
    isOptional?: boolean;
    default?: any;
    sanitize?: Sanitizer;
}
export interface Specification {
    [key: string]: IDetailedSpecification | Type | null;
}
export declare type Config = {
    [key: string]: any;
};
declare type ExtractConfigType<T> = T extends {
    sanitize: (...args: any[]) => infer U;
} ? U : T extends string ? FromType[T] : T extends null ? string : string;
export declare const describe: <T extends Specification, K extends keyof T>(specification: T, input?: {
    [key: string]: any;
} | null, defaults?: {
    [key: string]: any;
} | undefined) => { [Key in keyof T]: ExtractConfigType<T[Key]>; };
export {};
