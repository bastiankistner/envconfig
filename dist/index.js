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
console.log("😇");
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
    console.log({ input: input });
    if (typeof specification !== "object") {
        handleError("The first argument must be an object");
    }
    if (typeof input !== "object") {
        handleError("The second argument must be an object");
    }
    if (input === null) {
        return {};
    }
    return Object.keys(specification).reduce(function (acc, key) {
        var itemSpecification = specification[key];
        if (itemSpecification === null) {
            itemSpecification = {};
        }
        if (typeof itemSpecification === "string") {
            itemSpecification = {
                default: specification[key]
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
        if (type) {
            if (!sanitizers[type]) {
                handleError("Invalid specification: " + key + ".type is invalid (valid types are: " + Object.keys(sanitizers).join(", "));
            }
            var isStandardDefined = typeof rest.default !== "undefined";
            var wasInitiallyDefined = typeof value !== "undefined";
            if (!rest.isOptional && !wasInitiallyDefined && !isStandardDefined) {
                handleError("Required: " + key);
            }
            if (wasInitiallyDefined) {
                value = sanitizers[type](value);
            }
            if (typeof value === "undefined" && isStandardDefined) {
                value = value || rest.default;
            }
        }
        else {
            var item = itemSpecification;
            if (typeof item.sanitize !== "function") {
                handleError("Invalid specification: " + key + ".sanitize must be a function");
            }
            else {
                value = item.sanitize(value);
            }
        }
        if (typeof value === "undefined" && !rest.isOptional) {
            handleError("Required: " + key + " as " + (itemSpecification.name || key));
        }
        if (typeof value !== "undefined") {
            // @ts-ignore
            acc[key] = value;
        }
        return acc;
    }, {});
};
//# sourceMappingURL=index.js.map