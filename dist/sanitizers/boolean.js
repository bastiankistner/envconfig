"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TRUE_TEST = /true/i;
var FALSE_TEST = /false/i;
exports.default = (function (value) {
    if (typeof value === 'string') {
        if (TRUE_TEST.test(value)) {
            return true;
        }
        if (FALSE_TEST.test(value)) {
            return false;
        }
    }
    return Boolean(value);
});
//# sourceMappingURL=boolean.js.map