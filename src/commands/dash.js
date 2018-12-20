const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
const Table = require('cli-table')
const ccxt = require('ccxt')

class DashCommand extends Command {
  async run() {
    const {flags} = this.parse(DashCommand)

    if (flags.detailed) {
      let CUR = 'USD'   // account's default currency, fixed for now
      let lines = []   // array to hold precursor data for table
      let totalValue = 0    // variable to track total value of portfolio
      let table = new Table({
        head: ['Cryptocurrency', 'Exchange', 'Amount', 'Value'],
      })
      let nonEmpty = false
      cli.action.start('Fetching detailed portfolio')
      let userConfig = null

      try {
        userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
      } catch (error) {
        this.exit('Error reading config file')
      }

      if (userConfig.kraken) {
        let KrakenExchange = ccxt.kraken
        let kraken = new KrakenExchange({
          apiKey: userConfig.kraken.apiKey,
          secret: userConfig.kraken.secret,
          timeout: 3000,
          enableRateLimit: true,
        })
        let krakenTickerParams = []
        let krakenTickers = null
        let portfolio = null
        try {
          portfolio = await kraken.fetchBalance()
        } catch (error) {
          this.error('Error fetching kraken')
        }
        if (portfolio) {
          const {total} = portfolio
          for (const currency of Object.keys(total)) {
            if (total[currency] > 0) {
              krakenTickerParams.push(currency.toUpperCase() + '/' + CUR)
              lines.push({symbol: currency, amount: total[currency], value: -1})
            }
          }
          try {
            krakenTickers = await kraken.fetchTickers(krakenTickerParams)
          } catch (error) {
            this.error('Error fetching kraken tickers')
          }
          if (krakenTickers) {
            // push these values to the table
            lines.forEach(line => {
              let ticker = krakenTickers[line.symbol.toUpperCase() + '/' + CUR]
              let average = (ticker.open + ticker.close) / 2
              let value = line.amount * average
              totalValue += value
              table.push([line.symbol, 'Kraken', line.amount, value])
            })
          }
        }
      }
      table.push(['Total', '', '', totalValue])
      cli.action.stop()
      if (nonEmpty) {
        this.log(table.toString())
      }
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
        this.exit('Error reading config file')
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
          this.error('Error fetching kraken')
        }
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
          this.error('Error fetching binance')
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
  detailed: flags.boolean({char: 'd', description: 'Detailed portfolio with values across exchanges'}),
}

module.exports = DashCommand
