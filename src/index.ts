import * as sanitizers from './sanitizers';
import { PickByValue } from 'utility-types';

export enum Type {
	NUMBER = 'number',
	STRING = 'string',
	ARRAY = 'array',
	BOOLEAN = 'boolean',
	JSON = 'json',
}

type FromType = {
	number: number;
	string: string;
	array: string[];
	boolean: boolean;
	json: object;
	[key: string]: any;
};

export type Sanitizer = (value: any) => any;

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

function handleError(message: string) {
	console.error(message);
	throw new Error(message);
}

export type Config = {
	[key: string]: any;
};

type ExtractConfigType<T> = T extends { isOptional: true; sanitize: (...args: any[]) => infer U }
	? U | undefined
	: T extends { isOptional: false | undefined; sanitize: (...args: any[]) => infer U }
	? U
	: T extends { isOptional: true }
	? string | undefined
	: T extends string
	? FromType[T]
	: string;

export const describe = <T extends Specification, K extends keyof T>(
	specification: T,
	input: { [key: string]: any } | null = process.env,
	defaults?: { [key: string]: any }
): { [Key in keyof T]: ExtractConfigType<T[Key]> } => {
	if (typeof specification !== 'object') {
		handleError('The first argument must be an object');
	}

	if (typeof input !== 'object') {
		handleError('The second argument must be an object');
	}

	if (input === null) {
		return {} as { [Key in keyof T]: ExtractConfigType<T[Key]> };
	}

	return Object.keys(specification).reduce((acc, key) => {
		let itemSpecification = specification[key];

		if (itemSpecification === null) {
			itemSpecification = {};
		}

		if (typeof itemSpecification === 'string') {
			itemSpecification = {
				default: specification[key],
			};
		}

		const { type = Type.STRING, ...rest } = itemSpecification;
		let value = input[itemSpecification.name || key];

		if (defaults && defaults[key]) {
			value = defaults[key];
		}

		if (!type && !rest.sanitize) {
			handleError(`Invalid specification: either ${key}.type or ${key}.sanitize is required`);
		}

		if (itemSpecification.sanitize && typeof itemSpecification.sanitize !== 'function') {
			handleError(`Invalid specification: test.sanitize must be a function`);
		}

		if (typeof itemSpecification.sanitize === 'function') {
			value = itemSpecification.sanitize(value);
		} else {
			if (!sanitizers[type as Type]) {
				handleError(
					`Invalid specification: ${key}.type is invalid (valid types are: ${Object.keys(
						sanitizers
					).join(', ')}`
				);
			}

			const isStandardDefined = typeof rest.default !== 'undefined';
			const wasInitiallyDefined = typeof value !== 'undefined';

			if (!rest.isOptional && !wasInitiallyDefined && !isStandardDefined) {
				handleError(`Required: ${key}`);
			}

			if (wasInitiallyDefined) {
				value = sanitizers[type as Type](value);
			}

			if (typeof value === 'undefined' && isStandardDefined) {
				value = value || rest.default;
			}
		}

		if (typeof value === 'undefined' && !rest.isOptional) {
			handleError(`Required: ${key} as ${itemSpecification.name || key}`);
		}

		if (typeof value !== 'undefined') {
			// @ts-ignore
			acc[key] = value;
		}

		return acc;
	}, {}) as { [Key in keyof T]: ExtractConfigType<T[Key]> };
};
