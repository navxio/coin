coin
=======

A command line application to manage your cryptocurrency portfolio across exchanges

| currency | exchange | amount | value |
|----------|----------|--------|-------|
| omisego  | kraken   | 33     | $300  |
| bitcoin  | binance  | 0.02   | $2000 |
| ethereum | bitfinex | 2      | $200  |
| total    |          |        | $2500 |

#### Note: Under heavy development
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@navxio/coin.svg)](https://npmjs.org/package/@navxio/coin)
[![Downloads/week](https://img.shields.io/npm/dw/@navxio/coin.svg)](https://npmjs.org/package/@navxio/coin)
[![License](https://img.shields.io/npm/l/@navxio/coin.svg)](https://github.com/navdeepio/coin/blob/master/package.json)

<!-- toc -->
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Commands](#commands)
* [Supported Exchanges](#supported-exchanges)
* [Future Work](#future-work)
* [License](#license)
<!-- tocstop -->
# Installation

With npm

```
[sudo] npm i -g @navxio/coin
```
With yarn
```
yarn global add @navxio/coin
```

# Configuration

Need to setup the apiKeys and secrets of each enabled exchange in config.json at the following location

    Unix: ~/.config/@navxio/coin
    Windows: %LOCALAPPDATA%\@navxio\coin
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

# Usage
<!-- usage -->
```sh-session
$ npm install -g @navxio/coin
$ coin COMMAND
running command...
$ coin (-v|--version|version)
@navxio/coin/0.1.8 linux-x64 node-v11.5.0
$ coin --help [COMMAND]
USAGE
  $ coin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`coin dash`](#coin-dash)
* [`coin exchange`](#coin-exchange)
* [`coin help [COMMAND]`](#coin-help-command)
* [`coin order`](#coin-order)
* [`coin setup`](#coin-setup)
* [`coin ticker [EXCHANGE] [SYMBOL]`](#coin-ticker-exchange-symbol)
* [`coin update [CHANNEL]`](#coin-update-channel)

## `coin dash`

Display user portfolio in tabular form

```
USAGE
  $ coin dash

OPTIONS
  -d, --detailed           Detailed portfolio with values across exchanges
  -e, --exchange=exchange  The exchange to fetch the portfolio from

DESCRIPTION
  Display user portfolio in tabular form
```

_See code: [src/commands/dash.js](https://github.com/navdeepio/coin/blob/v0.1.8/src/commands/dash.js)_

## `coin exchange`

Exchange related configuration

```
USAGE
  $ coin exchange

OPTIONS
  -a, --available      Supported exchanges
  -e, --enabled        Enabled exchanges
  -r, --remove=remove  Remove an exchange from coin
  -s, --setup=setup    Setup a new exchange
```

_See code: [src/commands/exchange.js](https://github.com/navdeepio/coin/blob/v0.1.8/src/commands/exchange.js)_

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

## `coin order`

Describe the command here

```
USAGE
  $ coin order

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/order.js](https://github.com/navdeepio/coin/blob/v0.1.8/src/commands/order.js)_

## `coin setup`

Run through the setup wizard

```
USAGE
  $ coin setup
```

_See code: [src/commands/setup.js](https://github.com/navdeepio/coin/blob/v0.1.8/src/commands/setup.js)_

## `coin ticker [EXCHANGE] [SYMBOL]`

Fetch the ticker for a symbol for an exchange

```
USAGE
  $ coin ticker [EXCHANGE] [SYMBOL]
```

_See code: [src/commands/ticker.js](https://github.com/navdeepio/coin/blob/v0.1.8/src/commands/ticker.js)_

## `coin update [CHANNEL]`

update the coin CLI

```
USAGE
  $ coin update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_
<!-- commandsstop -->

# Supported Exchanges
* [Binance](https://www.binance.com)
* [Kraken](https://www.kraken.com)
* [Bitfinex](https://www.bitfinex.com)

# Future Work
* Delegate functionality to plugins
* Place orders
* Price preview
* More exchanges
* Coin Preferences

# License
GPL v3.0
