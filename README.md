# envconfig

based on mrboolean/envconfig

## Install

1. Fire up a Terminal.
1. Run `npm i passionkind/envconfig` or `yarn add passionkind/envconfig`.

## Usage

### Default Example

```typescript
import { parse } from 'dotenv';
import { create, Types } from 'envconfig';

const secretManagerServiceClient = new SecretManagerServiceClient();

import { STACKDRIVER_LOG_LEVEL_WINSTON } from './lib/constants';

const envconfig = create({
  // simple (just use process.env.MY_STRING_VAR and throw if it's unset)
  MY_STRING_VAR: null,
  // set a type other than string and use default value
  MY_BOOLEAN_VAR: {
    type: Types.BOOLEAN,
    default: true,
  },
  // sanitize, which infers a boolean type, and mark optional
  MY_SANITIZED_VAR: {
    isOptional: true,
    sanitize: v => v === 'true',
  },
});

// ---------------------------------------
// SIMPLE EXPORT APPROACH
envconfig.current = envconfig.init();
export default envconfig.current;


// ---------------------------------------
// MORE ADVANCED EXPORT APPROACH IN CASE YOU WANT TO ASYNCHRONOUSLY LOAD CONFIG FROM A URL

export function getConfig(): typeof envconfig['current'] {
  if (Object.keys(envconfig.current).length === 0) throw new Error('initConfig has not yet been called');
  return envconfig.current;
}

export async function initConfig(SECRET_MANAGER_SECRET_NAME = process.env.SECRET_MANAGER_SECRET_NAME) {
  let CONFIG_ROOT = process.env;

  if (process.env.NODE_ENV === 'production') {
    if (SECRET_MANAGER_SECRET_NAME === 'undefined') {
      throw new Error('SECRET_MANAGER_SECRET_NAME environment variable is not set and was not provided');
    }

    const [accessResponse] = await secretManagerServiceClient.accessSecretVersion({
      name: process.env.SECRET_MANAGER_SECRET_NAME,
    });

    const secretContent = accessResponse?.payload?.data?.toString();

    if (typeof secretContent !== 'string') {
      throw new Error('Could not access secret from Google Secret Manager');
    }

    CONFIG_ROOT = parse(secretContent);
  }

  envconfig.current = envconfig.init(CONFIG_ROOT);

  return envconfig.current;
}

## Supported Types

- string (DEFAULT)
- number
- array
- boolean
- object
