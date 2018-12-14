const {Command} = require('@oclif/command')
const {cli} = require('cli-ux')
const fs = require('fs-extra')
const path = require('path')

class SetupCommand extends Command {
  async run() {
    cli.info('Welcome to Coin!')
  }
}

SetupCommand.description = `Run through the setup wizard
***
Command be run at first launch
`
module.exports = SetupCommand
