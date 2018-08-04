import * as sanitizers from './sanitizers';

export enum Type {
  NUMBER = 'number',
  STRING = 'string',
  ARRAY = 'array',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

export type Sanitizer = (value: any) => any;

export interface Specification {
  [key: string]: {
    type?: Type;
    name: string;
    isRequired?: boolean;
    standard?: any;
    sanitize?: Sanitizer;
  };
}

export type Config = {
  [key: string]: any;
};

export const describe = <T extends { [key: string]: any }>(
  specification: Specification,
  input: { [key: string]: any } = process.env
): T => {
  if (typeof specification !== 'object') {
    throw new Error('The first argument must be an object');
  }

  if (typeof input !== 'object') {
    throw new Error('The second argument must be an object');
  }

  return Object.keys(specification).reduce<T>(
    (acc, key) => {
      const { name, type, ...rest } = specification[key];
      let value = input[name];

      if (!name) {
        throw new Error(`Invalid specification: ${key}.name is required`);
      }

      if (!type && !rest.sanitize) {
        throw new Error(`Invalid specification: either ${key}.type or ${key}.sanitize is required`);
      }

      if (type) {
        if (!sanitizers[type as Type]) {
          throw new Error(`Invalid specification: ${key}.type is invalid (valid types are: ${Object.keys(sanitizers).join(', ')}`);
        }

        const isStandardDefined = typeof rest.standard !== 'undefined';
        const wasInitiallyDefined = typeof value !== 'undefined';

        if (rest.isRequired && !wasInitiallyDefined && !isStandardDefined) {
          throw new Error(`Required: ${key}`);
        }

        if (wasInitiallyDefined) {
          value = sanitizers[type as Type](value);
        }

        if (typeof value === 'undefined' && isStandardDefined) {
          value = value || rest.standard;
        }
      } else {
        const item = specification[key];

        if (typeof item.sanitize !== 'function') {
          throw new Error(`Invalid specification: ${key}.sanitize must be a function`);
        }

        value = item.sanitize(value);
      }

      if (typeof value === 'undefined' && rest.isRequired) {
        throw new Error(`Required: ${key}`);
      }

      if (typeof value !== 'undefined') {
        acc[key] = value;
      }

      return acc;
    },
    {} as T
  );
};
