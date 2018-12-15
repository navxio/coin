const {Command, flags} = require('@oclif/command')
const fs = require('fs-extra')
const path = require('path')

class ExchangeCommand extends Command {
  async run() {
    const {flags} = this.parse(ExchangeCommand)
    if (flags.available) {
      this.log('Kraken\nBinance')
    }
    if (flags.enabled) {
      let enabled = []
      // read the config file, and find out the available keys
      try {
        let userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
        if (userConfig.kraken) {
          enabled.push('Kraken')
        }
        if (userConfig.binance) {
          enabled.push('Binance')
        }
        this.log(enabled.join('\n'))
      } catch (error) {
        this.log('Error reading config file')
      }
    }
    if (flags.setup) {
      // inquirer
    }
    if (flags.remove) {
      // inquirer
    }
  }
}

ExchangeCommand.description = `Generic exchange related configuration
`

ExchangeCommand.flags = {
  available: flags.boolean({char: 'a', description: 'Supported exchanges'}),
  enabled: flags.boolean({char: 'e', description: 'Enabled exchanges'}),
  setup: flags.string({description: 'Set up a new exchange'}),
  remove: flags.string({description: 'Remove an exchange from coin'}),
}

module.exports = ExchangeCommand
