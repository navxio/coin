const {Command} = require('@oclif/command')
const fs = require('fs-extra')
const path = require('path')
const ccxt = require('ccxt')
const Table = require('cli-table')
const ora = require('ora')
const dlog = require('debug')('worker:a')

class TickerCommand extends Command {
  async run() {
    const {args} = this.parse(TickerCommand)
    const {symbol, exchange} = args
    let userConfig = null
    const CUR = 'USD'  // fixed for now
    let table = null
    try {
      userConfig = fs.readJSONSync(path.join(this.config.configDir, 'config.json'))
    } catch (error) {
      this.error('Cannot find/read the config file')
      this.exit()
    }
    if (symbol) {
      // a symbol was specified
      // proceed as expected
      dlog('Found the symbol ' + symbol)
      if (exchange) {
        // an exchange was specified
        // if it
        dlog('Found the exchange ' + exchange)
        if (exchange in userConfig) {
          dlog('Found ' + exchange + ' in userconfig')
          // proceed
          ora('Loading ...').start()
          const ExchangeClass = ccxt[exchange]
          const config = userConfig[exchange]
          const exchangeClass = new ExchangeClass({
            apiKey: config.apiKey,
            secret: config.secret,
            timeout: 30000,
            enableRateLimit: true,
          })
          let ticker = null
          dlog('Fetching the ticker for ' + symbol.toUpperCase() + '/' + CUR)
          try {
            ticker = await exchangeClass.fetchTicker(symbol.toUpperCase() + '/' + CUR)
          } catch (error) {
            this.log(this.capitalize(exchange) + ' returned an error')
            this.exit()
          }
          table = new Table({
            head: ['Market Cap', '24h Volume', 'Circulating Supply', 'Total Suply', '1h %', '24h %', '7d %'],
          })
          this.log(ticker)
        } else {
          this.error('The specified exchange is unsupported or unconfigured.')
          this.exit()
        }
      } else {
        // fetch ticker from all exchanges
        table = new Table({
          head: ['Exchange', 'Market Cap', '24h Volume', 'Circulating Supply', 'Total Suply', '1h %', '24h %', '7d %'],
        })
      }
      this.log(table.toString())
    } else {
      this.log('Sorry please specify a symbol.')
      this.exit()
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

TickerCommand.description = `Fetch the ticker for a symbol for an exchange
`

TickerCommand.args = [
  {name: 'exchange'},
  {name: 'symbol'},
]

module.exports = TickerCommand
