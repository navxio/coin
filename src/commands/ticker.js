const {Command} = require('@oclif/command')
const fs = require('fs-extra')
const path = require('path')
const Table = require('cli-table')
const {cli} = require('cli-ux')
const dlog = require('debug')('worker:a')
const coinTicker = require('coin-ticker')

class TickerCommand extends Command {
  async run() {
    const {args} = this.parse(TickerCommand)
    const {symbol, exchange} = args
    let userConfig = null
    const CUR = 'USD'  // hardcoded for now
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
        // proceed
        if (exchange in userConfig) {
          cli.action.start('Loading')
          let ticker = null
          dlog('Fetching the ticker for ' + symbol.toUpperCase() + '/' + CUR)
          try {
            ticker = await coinTicker(exchange, symbol.toUpperCase() + '_' + CUR)
          } catch (error) {
            this.log(this.capitalize(exchange) + ' returned an error')
          }
          dlog('Ticker is ' + ticker)
          let table = new Table({
            head: ['Ask', 'Bid', 'Last', 'Volume', 'Low', 'High'],
          })
          const {ask, bid, last, vol, low, high} = ticker
          table.push([ask, bid, last, vol, low, high])
          cli.action.stop()
          this.log(table.toString())
        } else {
          this.log('Exchange "' + this.capitalize(exchange) + '" is unsupported')
        }
      } else {
        // fetch ticker from all exchanges
        this.log('No exchange specified. Will exit.')
      }
    } else {
      this.log('Symbol or exchange is missing. Please try again.')
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

TickerCommand.description = `Fetch the 24 hour ticker data
`

TickerCommand.args = [
  {name: 'exchange'},
  {name: 'symbol'},
]

module.exports = TickerCommand
