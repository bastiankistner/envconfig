"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
describe("@mrboolean/envconfig", function () {
    it("exports all known sanitizers", function () {
        expect(_1.Type.NUMBER).toBe("number");
        expect(_1.Type.STRING).toBe("string");
        expect(_1.Type.ARRAY).toBe("array");
        expect(_1.Type.BOOLEAN).toBe("boolean");
        expect(_1.Type.JSON).toBe("json");
    });
    it("fails without a specification", function () {
        expect(function () { return _1.describe(undefined); }).toThrow("The first argument must be an object");
    });
    it("fails without an input", function () {
        expect(function () { return _1.describe({}, 1); }).toThrow("The second argument must be an object");
    });
    it("fails without name", function () {
        expect(function () {
            return _1.describe({
                test: {}
            });
        }).toThrow("Invalid specification: test.name is required");
    });
    it("fails if the type is unknown", function () {
        expect(function () {
            return _1.describe({
                test: {
                    type: "unknown"
                }
            });
        }).toThrow("Invalid specification: test.type is invalid");
    });
    it("fails if the sanitize property does not contain a function", function () {
        expect(function () {
            return _1.describe({
                test: {
                    name: "test",
                    sanitize: 1
                }
            });
        }).toThrow("Invalid specification: test.sanitize must be a function");
    });
    it("uses the default value", function () {
        expect(_1.describe({
            test: {
                type: _1.Type.STRING,
                default: "some"
            }
        }, {})).toMatchObject({
            test: "some"
        });
    });
    it("uses the default sanitizer for default values", function () {
        expect(_1.describe({
            test: {
                type: _1.Type.BOOLEAN,
                default: "true"
            }
        }, { test: "true" })).toMatchObject({
            test: true
        });
    });
    it("throws an error if a property is required and not provided", function () {
        expect(function () {
            return _1.describe({
                test: {
                    type: _1.Type.STRING,
                    isOptional: false
                }
            });
        }).toThrow("Required: test");
    });
    it("uses the custom sanitizer", function () {
        expect(_1.describe({
            test: {
                sanitize: function () { return 1337; }
            }
        }, { test: "true" })).toMatchObject({
            test: 1337
        });
    });
    it("throws an error without type and sanitizer function", function () {
        expect(function () {
            return _1.describe({
                test: { name: "test" }
            });
        }).toThrow("Invalid specification: either test.type or test.sanitize is required");
    });
    it("throws an error if without a value", function () {
        expect(function () {
            return _1.describe({
                test: {
                    sanitize: function () { return undefined; },
                    isOptional: false
                }
            }, { test: 1 });
        }).toThrow("Required: test");
    });
    it("works without required fields", function () {
        expect(Object.keys(_1.describe({
            test: {
                type: _1.Type.BOOLEAN
            }
        }, {}))).toHaveLength(0);
    });
    it("works without unrequired fields and a default value", function () {
        expect(_1.describe({
            test: {
                type: _1.Type.BOOLEAN,
                default: false
            }
        }, {})).toMatchObject({
            test: false
        });
    });
    describe("sanitizers", function () {
        var sanitizerTests = [
            { type: _1.Type.NUMBER, inputValue: 1, expectedValue: 1 },
            { type: _1.Type.NUMBER, inputValue: "1", expectedValue: 1 },
            { type: _1.Type.NUMBER, inputValue: "1.2", expectedValue: 1.2 },
            { type: _1.Type.STRING, inputValue: "1", expectedValue: "1" },
            { type: _1.Type.STRING, inputValue: true, expectedValue: "true" },
            { type: _1.Type.ARRAY, inputValue: "1,2,3", expectedValue: ["1", "2", "3"] },
            { type: _1.Type.BOOLEAN, inputValue: "true", expectedValue: true },
            { type: _1.Type.BOOLEAN, inputValue: "TRUE", expectedValue: true },
            { type: _1.Type.BOOLEAN, inputValue: 1, expectedValue: true },
            { type: _1.Type.BOOLEAN, inputValue: "false", expectedValue: false },
            { type: _1.Type.BOOLEAN, inputValue: "FALSE", expectedValue: false },
            { type: _1.Type.BOOLEAN, inputValue: 0, expectedValue: false },
            { type: _1.Type.JSON, inputValue: '{"a":1}', expectedValue: { a: 1 } }
        ];
        sanitizerTests.forEach(function (_a) {
            var type = _a.type, inputValue = _a.inputValue, expectedValue = _a.expectedValue;
            it(type + " (" + inputValue + " [" + typeof inputValue + "] = " + expectedValue + " [" + typeof expectedValue + "]", function () {
                expect(_1.describe({
                    test: {
                        type: type,
                        isOptional: false
                    }
                }, { test: inputValue })).toMatchObject({
                    test: expectedValue
                });
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map