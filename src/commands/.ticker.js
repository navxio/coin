const {Command, flags} = require('@oclif/command')

class TickerCommand extends Command {
  async run() {
    const {args, flags} = this.parse(TickerCommand)
    const symbol = args.symbol
    const exchange = flags.exchange
  }

}

TickerCommand.description = `Fetch the ticker for a symbol, across exchanges
`

TickerCommand.args = {
  name: 'symbol',
}

TickerCommand.flags = {
  exchange: flags.string({char: 'e', description: 'The exchange from which to fetch the ticker'}),
}

module.exports = TickerCommand
