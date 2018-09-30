"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var sanitizers = __importStar(require("./sanitizers"));
var Type;
(function (Type) {
    Type["NUMBER"] = "number";
    Type["STRING"] = "string";
    Type["ARRAY"] = "array";
    Type["BOOLEAN"] = "boolean";
    Type["JSON"] = "json";
})(Type = exports.Type || (exports.Type = {}));
exports.describe = function (specification, input) {
    if (input === void 0) { input = process.env; }
    if (typeof specification !== 'object') {
        throw new Error('The first argument must be an object');
    }
    if (typeof input !== 'object') {
        throw new Error('The second argument must be an object');
    }
    return Object.keys(specification).reduce(function (acc, key) {
        var _a = specification[key], _b = _a.type, type = _b === void 0 ? Type.STRING : _b, rest = __rest(_a, ["type"]);
        var value = input[key];
        if (!type && !rest.sanitize) {
            throw new Error("Invalid specification: either " + key + ".type or " + key + ".sanitize is required");
        }
        if (type) {
            if (!sanitizers[type]) {
                throw new Error("Invalid specification: " + key + ".type is invalid (valid types are: " + Object.keys(sanitizers).join(', '));
            }
            var isStandardDefined = typeof rest.default !== 'undefined';
            var wasInitiallyDefined = typeof value !== 'undefined';
            if (!rest.isOptional && !wasInitiallyDefined && !isStandardDefined) {
                throw new Error("Required: " + key);
            }
            if (wasInitiallyDefined) {
                value = sanitizers[type](value);
            }
            if (typeof value === 'undefined' && isStandardDefined) {
                value = value || rest.default;
            }
        }
        else {
            var item = specification[key];
            if (typeof item.sanitize !== 'function') {
                throw new Error("Invalid specification: " + key + ".sanitize must be a function");
            }
            value = item.sanitize(value);
        }
        if (typeof value === 'undefined' && !rest.isOptional) {
            throw new Error("Required: " + key);
        }
        if (typeof value !== 'undefined') {
            acc[key] = value;
        }
        return acc;
    }, {});
};
//# sourceMappingURL=index.js.map