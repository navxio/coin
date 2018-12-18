const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
let ccxt = require('ccxt')
const Table = require('cli-table')


class DashCommand extends Command {
  async run() {
    const {flags} = this.parse(DashCommand)

    if (flags.detailed) {
      let table = new Table({
        head: ['Cryptocurrency', 'Exchange', 'Amount', 'Value'],
      })
      let nonEmpty = false
      cli.action.start('Fetching detailed portfolio')
      // move config load to lifecycle hooks
    } else {
      let table = new Table({
        head: ['Cryptocurrency', 'Exchange', 'Amount'],
      })
      let nonEmpty = false
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
        let kraken = new KrakenExchange({
          apiKey: userConfig.kraken.apiKey,
          secret: userConfig.kraken.secret,
          timeout: 3000,
          enableRateLimit: true,
        })
        let portfolio = null
        try {
          portfolio = await kraken.fetchBalance()
        } catch (error) {
          this.log('Error fetching kraken')
        }
        // can fetch ticker data for particular symbols
        // by passing in an array for argument ['eth/usd', 'xlm/usd']
        if (portfolio) {
          let total = portfolio.total
          for (const currency of Object.keys(total)) {
            if (total[currency] > 0) {
              table.push([currency, 'Kraken', total[currency]])
              nonEmpty = true
            }
          }
        }
      }
  
      if (userConfig.binance) {
        let BinanceExchange = ccxt.binance
        let binance = new BinanceExchange({
          apiKey: userConfig.binance.apiKey,
          secret: userConfig.binance.secret,
          timeout: 3000,
          enableRateLimit: true,
        })
  
        let portfolio = null
        try {
          portfolio = await binance.fetchBalance()
        } catch (error) {
          this.log('Error fetching binance')
        }
        if (portfolio) {
          let total = portfolio.total
          for (const currency of Object.keys(total)) {
            if (total[currency] > 0) {
              table.push([currency, 'Binance', total[currency]])
              nonEmpty = true
            }
          }
        }
      }
      cli.action.stop()
      if (nonEmpty) {
        this.log(table.toString())
      }
    }
  }
}

DashCommand.description = `
Display user portfolio in tabular form
`

DashCommand.flags = {
  detailed: flags.boolean({char: 'd', description: 'Detailed portfolio with values across exchanges'})
}

module.exports = DashCommand
