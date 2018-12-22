const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')

class SetupCommand extends Command {
  async run() {
    let config = {}
    let setup = false
    cli.info('Welcome to Coin!')
    try {
      let exists = await fs.pathExists(path.join(this.config.configDir, 'config.json'))
      if (exists) {
        let answer = await inquirer.prompt([{type: 'confirm', name: 'overwrite', message: 'Found a config file, overwrite?'}])
        if (answer.overwrite) {
          setup = true
        }
      } else {
        setup = true
      }
    } catch (error) {
      this.error(error)
    }
    if (setup) {
      let answers = await inquirer.prompt([{type: 'checkbox', message: 'Select the exchanges you wish to activate', choices: ['Kraken', 'Binance', 'Bitfinex'], name: 'exchanges'}])
      if (answers.exchanges.indexOf('Kraken') > -1) {
        let subConfig = {}
        this.log('Please input config variables for Kraken')
        let obj = await inquirer.prompt([{type: 'input', message: 'API Key', name: 'apiKey'}])
        subConfig.apiKey = obj.apiKey
        obj = await inquirer.prompt([{type: 'input', message: 'API Secret', name: 'secret'}])
        this.log('OK')
        subConfig.secret = obj.secret
        config.kraken = subConfig
      }
      if (answers.exchanges.indexOf('Binance') > -1) {
        let subConfig = {}
        this.log('Please input config variables for Binance')
        let obj = await inquirer.prompt([{type: 'input', message: 'API Key', name: 'apiKey'}])
        subConfig.apiKey = obj.apiKey
        obj = await inquirer.prompt([{type: 'input', message: 'API Secret', name: 'secret'}])
        this.log('OK')
        subConfig.secret = obj.secret
        config.binance = subConfig
      }
      if (answers.exchanges.indexOf('Bitfinex') > -1) {
        let subConfig = {}
        this.log('Please input config variables for Bitfinex')
        let obj = await inquirer.prompt([{type: 'input', message: 'API Key', name: 'apiKey'}])
        subConfig.apiKey = obj.apiKey
        obj = await inquirer.prompt([{type: 'input', message: 'API Secret', name: 'secret'}])
        this.log('OK')
        subConfig.secret = obj.secret
        config.bitfinex = subConfig
      }
      fs.writeJsonSync(path.join(this.config.configDir, 'config.json'), config)
      this.log('Successfully wrote ' + (path.join(this.config.configDir, 'config.json')))
    }
  }
}

SetupCommand.description = `Run through the setup wizard
`
module.exports = SetupCommand
