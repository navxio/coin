const {Command, flags} = require('@oclif/command')

class ExchangeCommand extends Command {
  async run() {
    const {flags} = this.parse(ExchangeCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/nav/dev/coin/src/commands/exchange.js`)
  }
}

ExchangeCommand.description = `Describe the command here
...
Extra documentation goes here
`

ExchangeCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ExchangeCommand
