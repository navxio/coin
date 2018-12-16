const {Command, flags} = require('@oclif/command')
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')

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
      let supportedExchanges = ['kraken', 'binance']
      let exchange = flags.setup
      let userConfig = null
      if (supportedExchanges.indexOf(exchange) > -1) {
        try {
          userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
        } catch (error) {
          this.log('Error reading config file, will exit.')
        }
        if (exchange in userConfig) {
          let {confirm} = await inquirer.prompt([{type: 'confirm', message: 'Exchange ' + exchange + ' already exists in config. Overwrite?'}])
          if (confirm) {
            let subConfig = {}
            this.log('Please input config variables for ' + exchange)
            let obj = await inquirer.prompt([{type: 'input', message: 'API Key', name: 'apiKey'}])
            subConfig.apiKey = obj.apiKey
            obj = await inquirer.prompt([{type: 'input', message: 'API Secret', name: 'secret'}])
            subConfig.secret = obj.secret
            userConfig[exchange] = subConfig
            fs.writeJsonSync(path.join(this.config.configDir, 'config.json'), userConfig)
            this.log('Successfully wrote ' + (path.join(this.config.configDir, 'config.json')))
          }
        } else {
          let subConfig = {}
          this.log('Please input config variables for ' + exchange)
          let obj = await inquirer.prompt([{type: 'input', message: 'API Key', name: 'apiKey'}])
          subConfig.apiKey = obj.apiKey
          obj = await inquirer.prompt([{type: 'input', message: 'API Secret', name: 'secret'}])
          subConfig.secret = obj.secret
          userConfig[exchange] = subConfig
          fs.writeJsonSync(path.join(this.config.configDir, 'config.json'), userConfig)
          this.log('Successfully wrote ' + (path.join(this.config.configDir, 'config.json')))
        }
      } else {
        this.log('Sorry, unsupported exchange.')
      }
    }
    if (flags.remove) {
      let exchange = flags.remove
      let userConfig = null
      let supportedExchanges = ['kraken', 'binance']
      try {
        userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
      } catch (error) {
        this.log('Error reading config file, will exit.')
      }
      if (supportedExchanges.indexOf(exchange) > -1) {
        let {confirm} = await inquirer.prompt([{type: 'confirm', message: 'Are you sure you want to remove ' + exchange, name: 'confirm'}])
        if (confirm) {
          delete userConfig[exchange]
          fs.writeJsonSync(path.join(this.config.configDir, 'config.json'), userConfig)
          this.log('Successfully wrote ' + (path.join(this.config.configDir, 'config.json')))
        }
      } else {
        this.log('Sorry, said exchange is not supported.')
      }
    }
  }
}

ExchangeCommand.description = `Exchange related configuration
`

ExchangeCommand.flags = {
  available: flags.boolean({char: 'a', description: 'Supported exchanges'}),
  enabled: flags.boolean({char: 'e', description: 'Enabled exchanges'}),
  setup: flags.string({char: 's', description: 'Setup a new exchange'}),
  remove: flags.string({char: 'r', description: 'Remove an exchange from coin'}),
}

module.exports = ExchangeCommand
