import * as sanitizers from './sanitizers';

export enum Type {
	NUMBER = 'number',
	STRING = 'string',
	ARRAY = 'array',
	BOOLEAN = 'boolean',
	JSON = 'json',
}

export type Sanitizer = (value: any) => any;

function handleError(message: string) {
	console.error(message);
	throw new Error(message);
}

export interface Specification {
	[key: string]:
		| {
				type?: Type;
				name?: string;
				isOptional?: boolean;
				default?: any;
				sanitize?: Sanitizer;
		  }
		| Type
		| null;
}

export type Config = {
	[key: string]: any;
};

export const describe = <T extends { [key: string]: any }>(
	specification: Specification,
	input: { [key: string]: any } = process.env
): T => {
	if (typeof specification !== 'object') {
		handleError('The first argument must be an object');
	}

	if (typeof input !== 'object') {
		handleError('The second argument must be an object');
	}

	return Object.keys(specification).reduce<T>(
		(acc, key) => {
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

			if (!type && !rest.sanitize) {
				handleError(`Invalid specification: either ${key}.type or ${key}.sanitize is required`);
			}

			if (type) {
				if (!sanitizers[type as Type]) {
					handleError(`Invalid specification: ${key}.type is invalid (valid types are: ${Object.keys(sanitizers).join(', ')}`);
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
			} else {
				const item = itemSpecification;

				if (typeof item.sanitize !== 'function') {
					handleError(`Invalid specification: ${key}.sanitize must be a function`);
				} else {
					value = item.sanitize(value);
				}
			}

			if (typeof value === 'undefined' && !rest.isOptional) {
				handleError(`Required: ${key}`);
			}

			if (typeof value !== 'undefined') {
        // @ts-ignore
				acc[key] = value;
			}

			return acc;
		},
		{} as T
	);
};
