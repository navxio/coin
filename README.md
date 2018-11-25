coin
=======

A command line application to manage your cryptocurrency portfolio across exchanges
| currency | exchange | amount | value |
|----------|----------|--------|-------|
| omisego  | kraken   | 33     | $300  |
| bitcoin  | binance  | 0.02   | $2000 |
| ethereum | bitfinex | 2      | $200  |
| total    |          |        | $2500 |


| currency | exchange | amount | value |
|----------|----------|--------|-------|
| omisego  | kraken   | 33     | $300  |
| bitcoin  | binance  | 0.02   | $2000 |
| ethereum | bitfinex | 2      | $200  |
| total    |          |        | $2500 |

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@navxio/coin.svg)](https://npmjs.org/package/@navxio/coin)
[![Downloads/week](https://img.shields.io/npm/dw/@navxio/coin.svg)](https://npmjs.org/package/@navxio/coin)
[![License](https://img.shields.io/npm/l/@navxio/coin.svg)](https://github.com/navdeepio/coin/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [License](#license)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @navxio/coin
$ coin COMMAND
running command...
$ coin (-v|--version|version)
@navxio/coin/0.0.2 linux-x64 node-v11.2.0
$ coin --help [COMMAND]
USAGE
  $ coin COMMAND
...
```

# Supported Exchanges
* Binance
* Bitfinex
<!-- usagestop -->
# Commands
<!-- commands -->
* [`coin dash`](#coin-dash)
* [`coin hello`](#coin-hello)
* [`coin help [COMMAND]`](#coin-help-command)

## `coin dash`

```
USAGE
  $ coin dash
```

_See code: [src/commands/dash.js](https://github.com/navdeepio/coin/blob/v0.0.2/src/commands/dash.js)_

## `coin hello`

Describe the command here

```
USAGE
  $ coin hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/navdeepio/coin/blob/v0.0.2/src/commands/hello.js)_

## `coin help [COMMAND]`

display help for coin

```
USAGE
  $ coin help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->

# Future Work
* Tests
* Place orders
* Price preview
* Detailed Dashboard
* More exchanges

# License
GPL v3.0
