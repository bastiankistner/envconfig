export declare enum Type {
    NUMBER = "number",
    STRING = "string",
    ARRAY = "array",
    BOOLEAN = "boolean",
    JSON = "json"
}
export declare type Sanitizer = (value: any) => any;
export interface Specification {
    [key: string]: {
        type?: Type;
        isOptional?: boolean;
        default?: any;
        sanitize?: Sanitizer;
    };
}
export declare type Config = {
    [key: string]: any;
};
export declare const describe: <T extends {
    [key: string]: any;
}>(specification: Specification, input?: {
    [key: string]: any;
}) => T;
