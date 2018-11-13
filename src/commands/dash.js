const {Command, flags} = require('@oclif/command')

class DashCommand extends Command {
  async run() {
    const {flags} = this.parse(DashCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/nav/dev/coincli/src/commands/dash.js`)
  }
}

DashCommand.description = `Describe the command here
...
Extra documentation goes here
`

DashCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = DashCommand
