const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
let ccxt = require('ccxt')
let kraken = null
let binance = null
const Table = require('cli-table')

const table = new Table({
  head: ['Cryptocurrency', 'Exchange', 'Amount', 'Value'],
})

class DashCommand extends Command {
  async run() {
    // start a spinner here
    cli.action.start('Fetching your portfolio')
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
      let portfolio = null
      try {
        portfolio = await kraken.fetchBalance()
      } catch (error) {
        this.log('error fetching kraken')
      }

      if (portfolio) {
        let total = portfolio.total
        for (var currency in total) {
          if (total.hasOwnProperty(currency) && total[currency] > 0) {
            table.push([currency, 'Kraken', total[currency], '10'])
          }
        }
      }
    }

    if (userConfig.binance) {
      let BinanceExchange = ccxt.binance
      binance = new BinanceExchange({
        apiKey: userConfig.binance.apiKey,
        secret: userConfig.binance.secret,
        timeout: 3000,
        enableRateLimit: true,
      })

      let portfolio = null
      try {
        portfolio = await binance.fetchBalance()
      } catch (error) {
        this.log('error fetching binance')
      }
      if (portfolio) {
        let total = portfolio.total
        for (var currency in total) {
          if (total.hasOwnProperty(currency) && total[currency] > 0) {
            table.push([currency, 'Binance', total[currency], '10'])
          }
        }
      }
    }

    this.log(table.toString())

    cli.action.stop()
  }
}

module.exports = DashCommand
