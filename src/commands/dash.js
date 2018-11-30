const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
const binance = require('../binance')
const kraken = require('../kraken')

class DashCommand extends Command {
  async run() {
    // start a spinner here
    cli.action.start('fetching your portfolio', {stdout: true})
    const userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json')
    this.log("it's empty")
    cli.action.stop()
  }
}

module.exports = DashCommand
