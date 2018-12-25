const {Command, flags} = require('@oclif/command')

class OrderCommand extends Command {
  async run() {
    const {flags} = this.parse(OrderCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/nav/dev/coin/coin-cli/src/commands/order.js`)
  }
}

OrderCommand.description = `Describe the command here
...
Extra documentation goes here
`

OrderCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = OrderCommand
