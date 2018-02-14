// @flow

const BOOLEAN_TRUE_TEST = /true/i;
const BOOLEAN_FALSE_TEST = /false/i;

const sanitizers = {
  number: (value: any): number => {
    if (typeof value === 'number') {
      return value;
    } else if (String(value).includes('.')) {
      return parseFloat(value);
    }

    return parseInt(value, 10);
  },
  string: (value: any): string => String(value),
  array: (value: any): Array<string> => String(value).split(','),
  boolean: (value: any): boolean => {
    if (typeof value === 'string' && BOOLEAN_TRUE_TEST.test(value)) {
      return true;
    } else if (typeof value === 'string' && BOOLEAN_FALSE_TEST.test(value)) {
      return false;
    }

    return Boolean(value);
  },
  json: (value: any): Object => JSON.parse(value),
};

export type Type = $Keys<typeof sanitizers>;
export type Sanitizer = (value: any) => any;

export type Specification = {
  [key: string]: {
    type?: Type,
    name: string,
    isRequired?: boolean,
    standard?: any,
    sanitize?: Sanitizer,
  },
};

export type Config = {
  [key: string]: any,
};

module.exports = (specification: Specification, input: Object = process.env): Config => {
  if (typeof specification !== 'object') {
    throw new Error('The first argument must be an object');
  }

  if (typeof input !== 'object') {
    throw new Error('The second argument must be an object');
  }

  return Object.keys(specification).reduce((acc, key) => {
    const {
      type, name, isRequired = false, sanitize = null, standard,
    } = specification[key];

    if (!name) {
      throw new Error(`Invalid specification: ${key}.name is required`);
    }

    if (!type && !sanitize) {
      throw new Error(`Invalid specification: either ${key}.type or ${key}.sanitize is required`);
    }

    if (type && !sanitizers[type]) {
      throw new Error(`Invalid specification: ${key}.type is invalid (valid types are: ${Object.keys(sanitizers).join(', ')}`);
    }

    if (!type && typeof sanitize !== 'function') {
      throw new Error(`Invalid specification: ${key}.sanitize must be a function`);
    }

    let value = input[key];
    const isStandardDefined = typeof standard !== 'undefined';
    const wasInitiallyDefined = typeof value !== 'undefined';

    if (isRequired && !wasInitiallyDefined && !isStandardDefined) {
      throw new Error(`Required: ${key}`);
    }

    if (wasInitiallyDefined && type && !sanitize) {
      value = sanitizers[type](value);
    } else if (wasInitiallyDefined && !type && sanitize) {
      value = sanitize(value);
    }

    if (typeof value === 'undefined' && isStandardDefined) {
      value = value || standard;
    }

    if (typeof value === 'undefined' && isRequired) {
      throw new Error(`Required: ${key}`);
    }

    if (typeof value !== 'undefined') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

module.exports.TYPE_NUMBER = 'number';
module.exports.TYPE_STRING = 'string';
module.exports.TYPE_ARRAY = 'array';
module.exports.TYPE_BOOLEAN = 'boolean';
module.exports.TYPE_JSON = 'json';
