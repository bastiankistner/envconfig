"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
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
function handleError(message) {
    console.error(message);
    throw new Error(message);
}
exports.describe = function (specification, input, defaults) {
    if (input === void 0) { input = process.env; }
    if (typeof specification !== 'object') {
        handleError('The first argument must be an object');
    }
    if (typeof input !== 'object') {
        // handleError('The second argument must be an object');
        // we will just return the spec and not throw anything
    }
    if (input === null) {
        return {};
    }
    var missingKeys = [];
    var config = Object.keys(specification).reduce(function (acc, key) {
        var itemSpecification = specification[key];
        if (itemSpecification === null) {
            itemSpecification = {};
        }
        if (typeof itemSpecification === 'string') {
            itemSpecification = {
                default: specification[key],
            };
        }
        var _a = itemSpecification.type, type = _a === void 0 ? Type.STRING : _a, rest = __rest(itemSpecification, ["type"]);
        var value = input[itemSpecification.name || key];
        if (defaults && defaults[key]) {
            value = defaults[key];
        }
        if (!type && !rest.sanitize) {
            handleError("Invalid specification: either " + key + ".type or " + key + ".sanitize is required");
        }
        if (itemSpecification.sanitize && typeof itemSpecification.sanitize !== 'function') {
            handleError("Invalid specification: test.sanitize must be a function");
        }
        // now parse the value
        var isStandardDefined = typeof rest.default !== 'undefined';
        var wasInitiallyDefined = typeof value !== 'undefined';
        if (!wasInitiallyDefined && !rest.isOptional && !isStandardDefined) {
            missingKeys.push(itemSpecification.name || key);
        }
        else {
            if (typeof itemSpecification.sanitize === 'function') {
                value = itemSpecification.sanitize(value);
            }
            else {
                if (!sanitizers[type]) {
                    handleError("Invalid specification: " + key + ".type is invalid (valid types are: " + Object.keys(sanitizers).join(', '));
                }
                if (wasInitiallyDefined) {
                    value = sanitizers[type](value);
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
    }, {});
    if (missingKeys.length > 0) {
        throw new Error("Values for keys [" + missingKeys.join(', ') + "] could not be found.");
    }
    return config;
};
function create(specification, configRoot) {
    if (configRoot === void 0) { configRoot = null; }
    var current = exports.describe(specification, configRoot);
    return {
        current: current,
        init: function (root) {
            if (root === void 0) { root = configRoot || process.env; }
            current = exports.describe(specification, root);
            return current;
        },
    };
}
exports.create = create;
//# sourceMappingURL=index.js.map