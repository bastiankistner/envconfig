declare module '@mrboolean/envconfig' {
  export const TYPE_NUMBER = 'number';
  export const TYPE_STRING = 'string';
  export const TYPE_ARRAY = 'array';
  export const TYPE_BOOLEAN = 'boolean';
  export const TYPE_JSON = 'json';

  export type SpecificationType =
    | typeof TYPE_NUMBER
    | typeof TYPE_STRING
    | typeof TYPE_ARRAY
    | typeof TYPE_BOOLEAN
    | typeof TYPE_JSON;
  export type SpecificationSanitizer = (value: any) => any;
  export type ConfigResult = {
    [key: string]: any;
  };

  interface Specification {
    [key: string]: {
      type?: SpecificationType;
      name: string;
      isRequired?: boolean;
      standard?: any;
      sanitize?: SpecificationSanitizer;
    };
  }
  export default function(specification: Specification, input: Object): ConfigResult;
}
