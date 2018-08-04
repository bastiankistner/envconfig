import { describe as envConfig, Type } from './';

describe('@mrboolean/envconfig', () => {
  it('exports all known sanitizers', () => {
    expect(Type.NUMBER).toBe('number');
    expect(Type.STRING).toBe('string');
    expect(Type.ARRAY).toBe('array');
    expect(Type.BOOLEAN).toBe('boolean');
    expect(Type.JSON).toBe('json');
  });

  it('fails without a specification', () => {
    expect(() => envConfig(undefined as any)).toThrow('The first argument must be an object');
  });

  it('fails without an input', () => {
    expect(() => envConfig({}, 1 as any)).toThrow('The second argument must be an object');
  });

  it('fails without name', () => {
    expect(() =>
      envConfig({
        test: {} as any,
      })
    ).toThrow('Invalid specification: test.name is required');
  });

  it('fails if the type is unknown', () => {
    expect(() =>
      envConfig({
        test: {
          name: 'test',
          type: 'unknown',
        } as any,
      })
    ).toThrow('Invalid specification: test.type is invalid');
  });

  it('fails if the sanitize property does not contain a function', () => {
    expect(() =>
      envConfig({
        test: {
          name: 'test',
          sanitize: 1,
        } as any,
      })
    ).toThrow('Invalid specification: test.sanitize must be a function');
  });

  it('uses the standard value', () => {
    expect(
      envConfig(
        {
          test: {
            type: Type.STRING,
            name: 'test',
            standard: 'some',
          },
        },
        {}
      )
    ).toMatchObject({
      test: 'some',
    });
  });

  it('uses the default sanitizer for standard values', () => {
    expect(
      envConfig(
        {
          test: {
            name: 'test',
            type: Type.BOOLEAN,
            standard: 'true',
          },
        },
        { test: 'true' }
      )
    ).toMatchObject({
      test: true,
    });
  });

  it('throws an error if a property is required and not provided', () => {
    expect(() =>
      envConfig({
        test: {
          name: 'test',
          type: Type.STRING,
          isRequired: true,
        },
      })
    ).toThrow('Required: test');
  });

  it('uses the custom sanitizer', () => {
    expect(
      envConfig<Object>(
        {
          test: {
            name: 'test',
            sanitize: () => 1337,
          },
        },
        { test: 'true' }
      )
    ).toMatchObject({
      test: 1337,
    });
  });

  it('throws an error without type and sanitizer function', () => {
    expect(() =>
      envConfig({
        test: { name: 'test' } as any,
      })
    ).toThrow('Invalid specification: either test.type or test.sanitize is required');
  });

  it('throws an error if without a value', () => {
    expect(() =>
      envConfig(
        {
          test: {
            name: 'test',
            sanitize: () => undefined,
            isRequired: true,
          },
        },
        { test: 1 }
      )
    ).toThrow('Required: test');
  });

  it('works without required fields', () => {
    expect(
      Object.keys(
        envConfig(
          {
            test: {
              name: 'test',
              type: Type.BOOLEAN,
            },
          },
          {}
        )
      )
    ).toHaveLength(0);
  });

  it('works without unrequired fields and a standard value', () => {
    expect(
      envConfig(
        {
          test: {
            name: 'test',
            type: Type.BOOLEAN,
            standard: false,
          },
        },
        {}
      )
    ).toMatchObject({
      test: false,
    });
  });

  describe('sanitizers', () => {
    const sanitizerTests = [
      { type: Type.NUMBER, inputValue: 1, expectedValue: 1 },
      { type: Type.NUMBER, inputValue: '1', expectedValue: 1 },
      { type: Type.NUMBER, inputValue: '1.2', expectedValue: 1.2 },
      { type: Type.STRING, inputValue: '1', expectedValue: '1' },
      { type: Type.STRING, inputValue: true, expectedValue: 'true' },
      { type: Type.ARRAY, inputValue: '1,2,3', expectedValue: ['1', '2', '3'] },
      { type: Type.BOOLEAN, inputValue: 'true', expectedValue: true },
      { type: Type.BOOLEAN, inputValue: 'TRUE', expectedValue: true },
      { type: Type.BOOLEAN, inputValue: 1, expectedValue: true },
      { type: Type.BOOLEAN, inputValue: 'false', expectedValue: false },
      { type: Type.BOOLEAN, inputValue: 'FALSE', expectedValue: false },
      { type: Type.BOOLEAN, inputValue: 0, expectedValue: false },
      { type: Type.JSON, inputValue: '{"a":1}', expectedValue: { a: 1 } },
    ];

    sanitizerTests.forEach(({ type, inputValue, expectedValue }) => {
      it(`${type} (${inputValue} [${typeof inputValue}] = ${expectedValue} [${typeof expectedValue}]`, () => {
        expect(
          envConfig(
            {
              test: {
                name: 'test',
                type,
                isRequired: true,
              },
            },
            { test: inputValue }
          )
        ).toMatchObject({
          test: expectedValue,
        });
      });
    });
  });
});
