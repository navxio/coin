const {Command} = require('@oclif/command')
const Table = require('cli-table')
const {cli} = require('cli-ux')
const dlog = require('debug')('worker:a')
const coinTicker = require('coin-ticker')
const supportedExchanges = require('../lib/supported-exchanges.js')

class TickerCommand extends Command {
  async run() {
    const {args} = this.parse(TickerCommand)
    const {symbol, exchange} = args
    const CUR = 'USD'  // hardcoded for now
    if (symbol) {
      // a symbol was specified
      // proceed as expected
      dlog('Found the symbol ' + symbol)
      if (exchange) {
        // an exchange was specified
        dlog('Found the exchange ' + exchange)
        // proceed
        if (supportedExchanges.indexOf(exchange) > -1) {
          cli.action.start(`Loading(${CUR})`)
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
          try {
            const {ask, bid, last, vol, low, high} = ticker
            table.push([ask, bid, last, vol, low, high])
            cli.action.stop()
            this.log(table.toString())
          } catch (error) {
            this.log('The symbol appears to be unsupported, please check it and try again.')
          }
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
