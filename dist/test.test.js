"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
describe('testing', function () {
    test('1', function () {
        var config = index_1.describe({
            SHOPIFY_API_LIMIT_RESTORE_POINTS_PER_SECOND: { default: 50, isOptional: true },
            SHOPIFY_API_LIMIT_MAX_POINTS: { default: 1000, isOptional: true },
            SHOPIFY_DEFAULT_API_VERSION: { default: '2019-07', isOptional: true },
            BOOL: { default: '2019-07', sanitize: function () { return 4; } },
            ANY_OTHER: index_1.Type.BOOLEAN,
        });
        // config.SHOPIFY_API_LIMIT_RESTORE_POINTS_PER_SECOND;
        // config.SHOPIFY_API_LIMIT_MAX_POINTS;
        // config.BOOL;
        // config.OOO
        // config.ANY_OTHER;
        // config.
    });
});
//# sourceMappingURL=test.test.js.map