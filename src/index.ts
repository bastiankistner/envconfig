import * as sanitizers from './sanitizers';

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

export type IDetailedSpecification = {
	type?: Type;
	name?: string;
	isOptional?: boolean;
	default?: any;
	sanitize?: Sanitizer;
};

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

type IsOptional = { isOptional: true };
type IsRequired = { isOptional?: false | undefined };
type AnyKey = { [key: string]: any };

type ExtractConfigType<T> = T extends IsOptional &
	AnyKey & {
		sanitize: (...args: any[]) => infer U;
	}
	? U
	: T extends IsRequired &
			AnyKey & {
				sanitize: (...args: any[]) => infer U;
			}
	? U
	: T extends IsOptional & AnyKey & { type: Type }
	? FromType[T['type']] | undefined
	: T extends IsRequired & AnyKey & { type: Type }
	? FromType[T['type']]
	: T extends AnyKey & { default: infer V }
	? V
	: T extends AnyKey & { isOptional: true }
	? string | undefined
	: T extends string
	? FromType[T]
	: string;

export type Description<T extends Specification> = { [Key in keyof T]: T[Key] extends null ? string : ExtractConfigType<T[Key]> };

export const describe = <T extends Specification>(
	specification: T,
	input: { [key: string]: any } | null = process.env,
	defaults?: { [key: string]: any }
): Description<T> => {
	if (typeof specification !== 'object') {
		handleError('The first argument must be an object');
	}

	if (typeof input !== 'object') {
		// handleError('The second argument must be an object');
		// we will just return the spec and not throw anything
	}

	if (input === null) {
		return {} as Description<T>;
	}

	const missingKeys: string[] = [];

	const config = Object.keys(specification).reduce((acc, key) => {
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

		// now parse the value

		const isStandardDefined = typeof rest.default !== 'undefined';
		const wasInitiallyDefined = typeof value !== 'undefined';

		if (!wasInitiallyDefined && !rest.isOptional && !isStandardDefined) {
			missingKeys.push(itemSpecification.name || key);
		} else {
			if (typeof itemSpecification.sanitize === 'function') {
				value = itemSpecification.sanitize(value);
			} else {
				if (!sanitizers[type as Type]) {
					handleError(`Invalid specification: ${key}.type is invalid (valid types are: ${Object.keys(sanitizers).join(', ')}`);
				}

				if (wasInitiallyDefined) {
					value = sanitizers[type as Type](value);
				}

				if (typeof value === 'undefined' && isStandardDefined) {
					value = value || rest.default;
				}
			}

			if (typeof value === 'undefined' && !rest.isOptional) {
				missingKeys.push(itemSpecification.name || key);
			}

			if (typeof value !== 'undefined') {
				// @ts-ignore
				acc[key] = value;
			}
		}

		return acc;
	}, {}) as Description<T>;

	if (missingKeys.length > 0) {
		throw new Error(`Values for keys [${missingKeys.join(', ')}] could not be found.`);
	}

	return config;
};

export function create<T extends Specification>(
	specification: T,
	configRoot = null
): { current: Description<T>; init: (root?: any) => Description<T> } {
	const current: Description<T> = describe(specification, configRoot);
	return {
		current,
		init: (root = configRoot || process.env) => {
			const next = describe(specification, root);

			for (let key in current) {
				delete current[key];
			}

			for (let key in next) {
				current[key] = next[key];
			}

			return current;
		},
	};
}
