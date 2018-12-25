const {Command, flags} = require('@oclif/command')
const fs = require('fs-extra')
const path = require('path')
const Table = require('cli-table')
const _ = require('lodash')
const ccxt = require('ccxt')
const Listr = require('listr')

class DashCommand extends Command {
  run() {
    const {flags} = this.parse(DashCommand)
    let table = null
    let userConfig = {}
    let exchanges = []
    let CUR = 'USD' // fixed at USD for now
    try {
      userConfig = fs.readJsonSync(path.join(this.config.configDir, 'config.json'))
    } catch (error) {
      this.exit('Cannot find / read config file')
    }
    for (const exchange of Object.keys(userConfig)) {
      const ExchangeClass = ccxt[exchange]
      const config = userConfig[exchange]
      const exchangeClass = new ExchangeClass({
        apiKey: config.apiKey,
        secret: config.secret,
        timeout: 30000,
        enableRateLimit: true,
      })
      exchanges.push({exchange, eClass: exchangeClass})
    }
    if (flags.exchange) {
      // fetch and print only from that exchange
      // launch a spinner
      // do something here
      if (userConfig[flags.exchange]) {
        this.log('something')
      } else {
        this.log('Sorry, said exchange is not supported or configured.')
      }
    } else {
      if (flags.detailed) {
        this.log('Fetching detailed portfolio...')
        table = new Table({
          head: ['Cryptocurrency', 'Exchange', 'Amount', 'Value'],
        })
        let tasksArray = _.map(exchanges, obj => {
          return {
            title: this.capitalize(obj.exchange),
            task: ctx =>  obj.eClass.fetchBalance().then(({total}) => {
              let params = []
              const name = obj.exchange
              let portfolio = {}
              for (const symbol of Object.keys(total)) {
                if (total[symbol] > 0) {
                  params.push(symbol + '/' + CUR)
                  portfolio[symbol] = total[symbol]
                }
              }
              ctx[name] = portfolio
              ctx.arr = ctx.arr || []
              return obj.eClass.fetchTickers(params)
            }).then(tickers => {
              const name = obj.exchange
              let portfolio = ctx[name]
              ctx = []
              for (const symbol of Object.keys(portfolio)) {
                const ticker = tickers[symbol + '/' + CUR]
                const avg = (ticker.open + ticker.close) / 2
                const amount = portfolio[symbol]
                ctx.arr.push({symbol, name, amount, value: avg * amount})
              }
            }).catch(error => {
              throw error
            }),
          }
        })
        let tasks = new Listr(tasksArray, {concurrent: true, exitOnError: false})
        tasks.run().then(context => {
          // debrief the context and update the table
          const {arr} = context
          if (arr.length > 0) {
            _.forEach(arr, value => {
              table.push([value.symbol, value.name, value.amount, value.value])
            })
          }
        }).catch(error => {
          const {context} = error
          // populate the table
          const {arr} = context
          if (arr.length > 0) {
            _.forEach(arr, value => {
              table.push([value.symbol, value.name, value.amount, value.value])
            })
          }
        })
      } else {
        this.log('Fetching portfolio...')
        table = new Table({
          head: ['Cryptocurrency', 'Exchange', 'Amount'],
        })
        let tasksArray = _.map(exchanges, obj => {
          return {
            title: this.capitalize(obj.exchange),
            task: ctx =>
              obj.eClass.fetchBalance().then(({total}) => {
                const name = obj.exchange
                let portfolio = {}
                for (const currency of Object.keys(total)) {
                  if (total[currency] > 0) {
                    portfolio[currency] = total[currency]
                  }
                }
                ctx[name] = portfolio
              }).catch(error => {
                throw error
              }),
          }
        })
        let tasks = new Listr(tasksArray, {concurrent: true, exitOnError: false})
        tasks.run().then(context => {
          // push it to table now
          for (const exchange of Object.keys(context)) {
            const portfolio = context[exchange]
            for (const symbol of Object.keys(portfolio)) {
              table.push([symbol, this.capitalize(exchange), portfolio[symbol]])
            }
          }
          this.log(table.toString())
        }).catch(error => {
          const {context} = error
          for (const exchange of Object.keys(context)) {
            const portfolio = context[exchange]
            for (const symbol of Object.keys(portfolio)) {
              table.push([symbol, this.capitalize(exchange), portfolio[symbol]])
            }
          }
          this.log(table.toString())
        })
      }
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

DashCommand.description = `
Display user portfolio in tabular form
`

DashCommand.flags = {
  detailed: flags.boolean({char: 'd', description: 'Detailed portfolio with values across exchanges'}),
  exchange: flags.string({char: 'e', description: 'The exchange to fetch the portfolio from'}),
}

module.exports = DashCommand
