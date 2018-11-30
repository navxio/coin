coin
=======

A command line application to manage your cryptocurrency portfolio across exchanges

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
* [Supported Exchanges](#supported-exchanges)
* [Configuration](#configuration)
* [Future Work](#future-work)
* [License](#license)
<!-- tocstop -->
# Install

With npm

```
[sudo] npm i -g @navxio/coin
```
With yarn
```
yarn global add @navxio/coin
```

# Usage
<!-- usage -->
```sh-session
$ coin COMMAND
running command...
$ coin (-v|--version|version)
@navxio/coin/0.0.6 linux-x64 node-v11.3.0
$ coin --help [COMMAND]
USAGE
  $ coin COMMAND
...
```
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

_See code: [src/commands/dash.js](https://github.com/navdeepio/coin/blob/v0.0.6/src/commands/dash.js)_

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

_See code: [src/commands/hello.js](https://github.com/navdeepio/coin/blob/v0.0.6/src/commands/hello.js)_

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

# Supported Exchanges
* [Binance](https://www.binance.com)
* [Bitfinex](https://www.bitfinex.com)
* [Kraken](https://www.kraken.com)


# Configuration

Need to setup the apiKeys and secrets of each enabled exchange in config.json at the following location

    Unix: ~/.config/coin
    Windows: %LOCALAPPDATA%\coin
    Can be overridden with XDG_CONFIG_HOME


Example Configuration File

```
{
  "binance": {
    "apiKey": "binance-api-key",
    "secret": "my-binance-secret"
  },
  "bitfinex": {
    "apiKey": "bitfinex-api-key",
    "secret": "my-bitfinex-secret"
  }
}
```

# Future Work
* Tests
* Place orders
* Price preview
* Detailed Dashboard
* More exchanges
* CLI prefs

# License
GPL v3.0
