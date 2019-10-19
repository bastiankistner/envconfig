import { describe as describeConfig, Type } from './index';

describe('testing', () => {
	test('1', () => {
		const config = describeConfig({
			SHOPIFY_API_LIMIT_RESTORE_POINTS_PER_SECOND: { default: 50, isOptional: true },
			SHOPIFY_API_LIMIT_MAX_POINTS: { default: 1000, isOptional: true },
			SHOPIFY_DEFAULT_API_VERSION: { default: '2019-07', isOptional: true },
			BOOL: { default: '2019-07', isOptional: true, sanitize: () => 4 },
			ANY_OTHER: Type.BOOLEAN,
		});

		config.SHOPIFY_API_LIMIT_RESTORE_POINTS_PER_SECOND;
		config.SHOPIFY_API_LIMIT_MAX_POINTS;
		config.BOOL;
		config.ANY_OTHER;
	});
});
