const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
let ccxt = require('ccxt')
let kraken = null
let binance = null

class DashCommand extends Command {
  async run() {
    // start a spinner here
    cli.action.start('Fetching your portfolio.. ')
    let userConfig = null
    try {
      userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
    } catch (error) {
      this.log('Error reading config file')
    }

    if (userConfig.kraken) {
      let KrakenExchange = ccxt.kraken
      kraken = new KrakenExchange({
        apiKey: userConfig.kraken.apiKey,
        secret: userConfig.kraken.secret,
        timeout: 3000,
        enableRateLimit: true,
      })
      this.log(await kraken.fetchBalance())
    }

    if (userConfig.binance) {
      let BinanceExchange = ccxt.binance
      binance = new BinanceExchange({
        apiKey: userConfig.binance.apiKey,
        secret: userConfig.binance.secret,
        timeout: 3000,
        enableRateLimit: true,
      })
      this.log(await binance.fetchBalance())
    }

    cli.action.stop()
  }
}

module.exports = DashCommand
