const {Command} = require('@oclif/command')

class KrakenCommand extends Command {
  async run() {
    const {args} = this.parse(KrakenCommand)
    const symbol = args.symbol

    if (symbol) {
      // hello world
    }
  }
}

KrakenCommand.description = `Describe the command here
...
Extra documentation goes here
`
KrakenCommand.args = [
  {name: 'symbol'}
]

module.exports = KrakenCommand
