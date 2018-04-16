const {
  describe: doIt,
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_BOOLEAN,
  TYPE_JSON,
} = require('./');

describe('@mrboolean/envconfig', () => {
  it('exports all known sanitizers', () => {
    expect(TYPE_NUMBER).toBe('number');
    expect(TYPE_STRING).toBe('string');
    expect(TYPE_ARRAY).toBe('array');
    expect(TYPE_BOOLEAN).toBe('boolean');
    expect(TYPE_JSON).toBe('json');
  });

  it('fails without a specification', () => {
    expect(() => doIt()).toThrow('The first argument must be an object');
  });

  it('fails without an input', () => {
    expect(() => doIt({}, 1)).toThrow('The second argument must be an object');
  });

  it('fails without name', () => {
    expect(() =>
      doIt({
        test: {},
      })).toThrow('Invalid specification: test.name is required');
  });

  it('fails if the type is unknown', () => {
    expect(() =>
      doIt({
        test: {
          name: 'test',
          type: 'unknown',
        },
      })).toThrow('Invalid specification: test.type is invalid');
  });

  it('fails if the sanitize property does not contain a function', () => {
    expect(() =>
      doIt({
        test: {
          name: 'test',
          sanitize: 1,
        },
      })).toThrow('Invalid specification: test.sanitize must be a function');
  });

  it('uses the standard value', () => {
    expect(doIt(
      {
        test: {
          name: 'test',
          type: TYPE_STRING,
          standard: 'some',
        },
      },
      {},
    )).toMatchObject({
      test: 'some',
    });
  });

  it('uses the default sanitizer for standard values', () => {
    expect(doIt(
      {
        test: {
          name: 'test',
          type: TYPE_BOOLEAN,
          standard: 'true',
        },
      },
      { test: 'true' },
    )).toMatchObject({
      test: true,
    });
  });

  it('throws an error if a property is required and not provided', () => {
    expect(() =>
      doIt({
        test: {
          name: 'test',
          type: TYPE_STRING,
          isRequired: true,
        },
      })).toThrow('Required: test');
  });

  it('uses the custom sanitizer', () => {
    expect(doIt(
      {
        test: {
          name: 'test',
          sanitize: () => 1337,
        },
      },
      { test: 'true' },
    )).toMatchObject({
      test: 1337,
    });
  });

  it('throws an error without type and sanitizer function', () => {
    expect(() =>
      doIt({
        test: { name: 'test' },
      })).toThrow('Invalid specification: either test.type or test.sanitize is required');
  });

  it('throws an error if without a value', () => {
    expect(() =>
      doIt(
        {
          test: {
            name: 'test',
            sanitize: () => undefined,
            isRequired: true,
          },
        },
        { test: 1 },
      )).toThrow('Required: test');
  });

  it('works without required fields', () => {
    expect(Object.keys(doIt(
      {
        test: {
          name: 'test',
          type: TYPE_BOOLEAN,
        },
      },
      {},
    ))).toHaveLength(0);
  });

  it('works without unrequired fields and a standard value', () => {
    expect(doIt(
      {
        test: {
          name: 'test',
          type: TYPE_BOOLEAN,
          standard: false,
        },
      },
      {},
    )).toMatchObject({
      test: false,
    });
  });

  describe('sanitizers', () => {
    const sanitizerTests = [
      { type: TYPE_NUMBER, inputValue: 1, expectedValue: 1 },
      { type: TYPE_NUMBER, inputValue: '1', expectedValue: 1 },
      { type: TYPE_NUMBER, inputValue: '1.2', expectedValue: 1.2 },
      { type: TYPE_STRING, inputValue: '1', expectedValue: '1' },
      { type: TYPE_STRING, inputValue: true, expectedValue: 'true' },
      { type: TYPE_ARRAY, inputValue: '1,2,3', expectedValue: ['1', '2', '3'] },
      { type: TYPE_BOOLEAN, inputValue: 'true', expectedValue: true },
      { type: TYPE_BOOLEAN, inputValue: 'TRUE', expectedValue: true },
      { type: TYPE_BOOLEAN, inputValue: 1, expectedValue: true },
      { type: TYPE_BOOLEAN, inputValue: 'false', expectedValue: false },
      { type: TYPE_BOOLEAN, inputValue: 'FALSE', expectedValue: false },
      { type: TYPE_BOOLEAN, inputValue: 0, expectedValue: false },
      { type: TYPE_JSON, inputValue: '{"a":1}', expectedValue: { a: 1 } },
    ];

    sanitizerTests.forEach(({ type, inputValue, expectedValue }) => {
      it(`${type} (${inputValue} [${typeof inputValue}] = ${expectedValue} [${typeof expectedValue}]`, () => {
        expect(doIt(
          {
            test: {
              name: 'test',
              type,
              isRequired: true,
            },
          },
          { test: inputValue },
        )).toMatchObject({
          test: expectedValue,
        });
      });
    });
  });
});
