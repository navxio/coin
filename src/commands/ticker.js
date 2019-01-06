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
        // proceed
        if (!(exchange in userConfig)) {
          this.log('Warning: Exchange ' + exchange + ' may be unsupported')
        }
        cli.action.start('Loading')
        let ticker = null
        dlog('Fetching the ticker for ' + symbol.toUpperCase() + '/' + CUR)
        try {
          ticker = await coinTicker(exchange, symbol.toUpperCase() + '_' + CUR)
        } catch (error) {
          this.log(this.capitalize(exchange) + ' returned an error')
          this.exit()
        }
        table = new Table({
          head: ['Market Cap', '24h Volume', 'Circulating Supply', 'Total Suply', '1h %', '24h %', '7d %'],
        })
        cli.action.stop()
        this.log(ticker)
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
