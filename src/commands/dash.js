const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
let ccxt = require('ccxt')
let kraken = null
let binance = null
let bitfinex = null

class DashCommand extends Command {
  async run() {
    // start a spinner here
    cli.action.start('fetching your portfolio', {stdout: true})
    const userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))

    if (userConfig.kraken) {
      let KrakenExchange = ccxt.kraken
      kraken = new KrakenExchange({
        apiKey: userConfig.kraken.apiKey,
        secret: userConfig.kraken.secret,
        timeout: 3000,
        enableRateLimit: true,
      })
    }

    if (userConfig.binance) {
      let BinanceExchange = ccxt.binance
      binance = new BinanceExchange({
        apiKey: userConfig.binance.apiKey,
        secret: userConfig.binance.secret,
        timeout: 3000,
        enableRateLimit: true,
      })
    }

    if (userConfig.bitfinex) {
      let BitFinexExchange = ccxt.bitfinex
      binance = new BitFinexExchange({
        apiKey: userConfig.bitfinex.apiKey,
        secret: userConfig.bitfinex.secret,
        timeout: 3000,
        enableRateLimit: true,
      })
    }

    // fetch portfolio here
    // and populate to the table
    cli.action.stop()
  }
}

module.exports = DashCommand
