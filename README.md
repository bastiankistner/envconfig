# env-cfg

[![Build Status](https://travis-ci.org/MrBoolean/env-cfg.svg?branch=master)](https://travis-ci.org/MrBoolean/env-cfg)

## Install

1. Fire up a Terminal.
1. Run `npm i env-cfg` or `yarn add env-cfg`.

## Usage

### Standard

```javascript
const envCfg = require('env-cfg');

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
const envCfg = require('env-cfg');

module.exports = envCfg({
    custom: {
        name: 'CUSTOM',
        sanitize: value => (value === 1 ? false : true),
    },
});
```

## Supported Types

`env-cfg` supports these field types:

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
