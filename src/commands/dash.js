const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')

class DashCommand extends Command {
  async run() {
    // start a spinner here
    cli.action.start('fetching your portfolio', {stdout: true})
    this.log('it"s empty')
    cli.action.stop()
  }
}

module.exports = DashCommand
