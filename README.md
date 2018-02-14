# envconfig

[![Build Status](https://travis-ci.org/MrBoolean/envconfig.svg?branch=master)](https://travis-ci.org/MrBoolean/envconfig) [![Maintainability](https://api.codeclimate.com/v1/badges/d78a9e4a4d079f980c01/maintainability)](https://codeclimate.com/github/MrBoolean/envconfig/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/d78a9e4a4d079f980c01/test_coverage)](https://codeclimate.com/github/MrBoolean/envconfig/test_coverage) [![npm (scoped)](https://img.shields.io/npm/v/@mrboolean/envconfig.svg)]() [![npm](https://img.shields.io/npm/dm/@mrboolean/envconfig.svg)]()

## Install

1. Fire up a Terminal.
1. Run `npm i @mrboolean/envconfig` or `yarn add @mrboolean/envconfig`.

## Usage

### Standard

```javascript
const envCfg = require('@mrboolean/envconfig');

const config = envCfg({
    isDebug: {
        name: 'DEBUG',
        type: envCfg.TYPE_BOOLEAN,
        isRequired: true,
        standard: false,
    },
    port: {
        name: 'BIND_PORT',
        type: envCfg.TYPE_NUMBER,
        standard: 8080,
    },
});

console.log(config);
```

Results:

```json
{
    "isDebug": false,
    "port": 8080
}
```

### Custom sanitizer

```javascript
const envCfg = require('@mrboolean/envconfig');

module.exports = envCfg({
    custom: {
        name: 'CUSTOM',
        sanitize: value => (value === 1 ? false : true),
    },
});
```

## Supported Types

`@mrboolean/envconfig` supports these field types:

* number
* string
* array
* boolean
* json

## License

Copyright 2018 Marc Binder <mailto:marcandrebinder@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
