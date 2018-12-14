const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
let ccxt = require('ccxt')
const Table = require('cli-table')
let resultArray = []

const table = new Table({
  head: ['Cryptocurrency', 'Exchange', 'Amount'],
})

class DashCommand extends Command {
  async run() {
    // what's my default currency
    let CUR = 'USD'
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
      let krakenTickers = null
      try {
        portfolio = await kraken.fetchBalance()
      } catch (error) {
        this.log('error fetching kraken')
      }
      // can fetch ticker data for particular symbols
      // by passing in an array for argument ['eth/usd', 'xlm/usd']
      if (portfolio) {
        let total = portfolio.total
        let tickerParam = []
        for (const currency of Object.keys(total)) {
          if (total[currency] > 0) {
            resultArray.push({symbol: currency, exchange: 'Kraken', amount: total[currency], value: 0})
            tickerParam.push(currency + '/' + CUR)
          }
        }
        try {
          krakenTickers = await kraken.fetchTickers(tickerParam)
        } catch (error) {
          this.log('something went wrong fetching the kraken tickers')
        }
        // do this the functional way
        let finalArray = resultArray.map(line => {
          const symbol = line.symbol
          const ticker = krakenTickers[symbol + '/' + CUR]
          const average = (ticker.open + ticker.close) / 2
          line.value = line.amount * average
          return line
        })
        resultArray = finalArray
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
      let binanceTickers = null
      try {
        portfolio = await binance.fetchBalance()
      } catch (error) {
        this.log('error fetching binance')
      }
      if (portfolio) {
        let total = portfolio.total
        let tickerParam = []
        for (const currency of Object.keys(total)) {
          if (total[currency] > 0) {
            resultArray.push({symbol: currency, exchange: 'Binance', amount: total[currency], value: 0})
            tickerParam.push(currency + '/' + CUR)
          }
        }
        try {
          binanceTickers = await binance.fetchTickers(tickerParam)
        } catch (error) {
          this.log('something went wrong fetching the binance tickers')
        }
        let binanceArray = resultArray.filter(line => {
          return line.exchange === 'Binance'
        })
        let finalArray = binanceArray.map(line => {
          const symbol = line.symbol
          const ticker = binanceTickers[symbol + '/' + CUR]
          const average = (ticker.open + ticker.close) / 2
          line.value = line.amount * average
          return line
        })
        resultArray.concat(finalArray)
      }
    }
    this.log('Result array: ', resultArray)

    resultArray.forEach(line => {
      table.push([line.symbol, line.exchange, line.amount, line.value])
    })

    cli.action.stop()
    this.log(table.toString())
  }
}

module.exports = DashCommand
