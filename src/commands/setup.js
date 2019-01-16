const {Command} = require('@oclif/command')
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const supportedExchanges = require('../lib/supported-exchanges.js')

class SetupCommand extends Command {
  async run() {
    let config = {}
    let setup = false
    this.log('Welcome to Coin!')
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
      const choices = supportedExchanges.map(exchange => this.capitalize(exchange))
      let answers = await inquirer.prompt([{type: 'checkbox', message: 'Select the exchanges you wish to activate', choices, name: 'exchanges'}])
      answers.forEach(async function (answer) {
        let subConfig = {}
        this.log('Please input configuration variables for ' + this.capitalize(answer) + ':')
        let obj = await inquirer.prompt([{type: 'input', message: 'API Key', name: 'apiKey'}])
        subConfig.apiKey = obj.apiKey
        obj = await inquirer.prompt([{type: 'input', message: 'API Secret', name: 'secret'}])
        this.log('OK')
        subConfig.secret = obj.secret
        config[answer] = subConfig
      })
      fs.writeJsonSync(path.join(this.config.configDir, 'config.json'), config)
      this.log('Successfully wrote ' + (path.join(this.config.configDir, 'config.json')))
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

SetupCommand.description = `Run through the setup wizard
`
module.exports = SetupCommand
