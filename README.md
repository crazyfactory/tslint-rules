# tslint-rules

<!--[![Greenkeeper badge](https://badges.greenkeeper.io/crazyfactory/tslint-rules.svg)](https://greenkeeper.io/) -->
[![Build Status](https://travis-ci.org/crazyfactory/tslint-rules.svg)](https://travis-ci.org/crazyfactory/tslint-rules)
[![GitHub issues](https://img.shields.io/github/issues/crazyfactory/tslint-rules.svg)](https://github.com/crazyfactory/tslint-rules/issues)
[![codecov](https://codecov.io/gh/crazyfactory/tslint-rules/branch/master/graph/badge.svg)](https://codecov.io/gh/crazyfactory/tslint-rules)
[![devDependencies Status](https://david-dm.org/crazyfactory/tslint-rules/dev-status.svg)](https://david-dm.org/crazyfactory/tslint-rules?type=dev)
[![dependencies Status](https://david-dm.org/crazyfactory/tslint-rules/status.svg)](https://david-dm.org/crazyfactory/tslint-rules)

Contains lint rules for Crazy Factory

- Typescript 3.x
- packs it for npm usage
- uses jest for testing
- uses travis and semantic-release for deployment
- uses linting, coverage and git hooks to increase code quality.
- is configured to support wallaby

## Usage

Initially you should:

- npm install `@crazyfactory/tslint-rules`
- update `tslint.json` (add rules directory)
- enable rules in `tslint.json`

## Rules

### `create-async-actions`
  - In [ts-react-boilerplate](https://github.com/crazyfactory/ts-react-boilerplate), we use `createAsyncActions` to 
  create Redux async actions. Four actions are created from calling it - `BASE`, `BASE_PENDING`, `BASE_FULFILLED`, and
  `BASE_REJECTED` as an example when `createAsyncActions("BASE", "BASE_PENDING", "BASE_FULFILLED", "BASE_REJECTED"` is
  called. Still, as you see, we need to provide string literal as arugments due to typescript limitation, if we provide
  any string variable, the type will be deduced to just `string`. This rule enforces 2nd, 3rd, and 4th argument to be
  the concatenation of the first argument string and `_PENDING`, `_FULFILLED`, and `_REJECTED` respectively.
### `import-react`
  - Specify how you should import `react`. Either `import *` or `import React`.
  - Rule options:
    - `type: "default" | "star"`. Default is `star`
### `hex-format`
  - Requires literal string in hex format to be uppercase/lowercase and/or of specific lengths.
  - Rule options: 
    - `case: "uppercase" | "lowercase"`. Default is `lowercase`
    - `allowedLengths: number[]`. Default is `[4, 7]`
### `interface-sort-keys`
  - Same as [object-literal-sort-keys](https://palantir.github.io/tslint/rules/object-literal-sort-keys/) but applied to
  interface keys
### `jsx-space-before-trailing-slash`
  - Requires or bans space before `/>` part of jsx.
  - Rule options:
    - `["always", "never"]`. Default is `always`.
### `language`
  - Requires that string argument called by `Translator` object is in the `reference.json`
  - Rule options:
    - `path`: path to `reference.json`

    `reference.json` needs to be in the following format:

    ```
      {
        "reference": [
          {
            "base": "Translation String Here"
          }
        ]
      }
    ```
    - `callerNames: string[]`: Name of translator object type, default is `["Translator"]`
### `no-dup-actions`
  - Requires that all actions created by [createAsyncActions](https://github.com/crazyfactory/ts-react-boilerplate/blob/master/src/app/redux/modules/baseModule.ts)
  and [createAction](https://github.com/piotrwitek/typesafe-actions#createaction) have unique name.
