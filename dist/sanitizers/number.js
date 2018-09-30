"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (value) {
    if (typeof value === 'number') {
        return value;
    }
    if (("" + value).includes('.')) {
        return parseFloat(value);
    }
    return parseInt(value, 10);
});
//# sourceMappingURL=number.js.map