const {Command, flags} = require('@oclif/command')
const fs = require('fs-extra')
const path = require('path')
const Table = require('cli-table')
const ccxt = require('ccxt')
const Listr = require('listr')
const coinTicker = require('coin-ticker')
const {cli} = require('cli-ux')
const CUR = 'USD' // hardcoded for now

class DashCommand extends Command {
  run() {
    const {flags} = this.parse(DashCommand)
    let table = null
    let userConfig = {}
    let exchanges = []
    try {
      userConfig = fs.readJsonSync(path.join(this.config.configDir, 'config.json'))
    } catch (error) {
      this.exit('Cannot find / read config file')
    }
    if (flags.exchange) {
      if (flags.detailed) {
        const exchange = flags.exchange
        if (userConfig[exchange]) {
          cli.action.start(`Loading detailed portfolio from ${this.capitalize(exchange)}`)
          let table = new Table({
            head: ['Symbol', 'Amount', 'Value'],
          })
          const ExchangeClass = ccxt[exchange]
          const config = userConfig[exchange]
          const exchangeClass = new ExchangeClass({
            apiKey: config.apiKey,
            secret: config.secret,
            timeout: 30000,
            enableRateLimit: true,
          })
          new Listr([
            {
              title: 'Fetch portfolio',
              task: context => {
                let portfolio = {}
                exchangeClass.fetchBalance().then(({total}) => {
                  for (const symbol in total) {
                    if (total[symbol] > 0) {
                      portfolio[symbol] = total[symbol]
                    }
                  }
                  context.portfolio = portfolio
                })
              },
            },
            {
              title: 'Fetch tickers',
              task: context => {
                const {portfolio} = context
                let prices = {}
                Object.keys(portfolio).map(async symbol => {
                  const ticker = await coinTicker(exchange, symbol + '_' + CUR)
                  prices[symbol] = this.average(ticker)
                })
                context.prices = prices
              },
            },
          ]).run().then(result => {
            const {portfolio, prices} = result
            // for (const exchange in portfolio) {
            //   if ({}.hasOwnProperty.call(portfolio, exchange)) {
            //     for (const symbol in portfolio[exchange]) {
            //       if ({}.hasOwnProperty.call(portfolio[exchange], symbol)) {
            //         const amount = portfolio[exchange][symbol]
            //         const value = prices[symbol] * amount
            //         table.push([exchange, symbol, amount, value])
            //       }
            //     }
            //   }
            // }
            for (const symbol in portfolio) {
              if ({}.hasOwnProperty.call(portfolio, symbol)) {
                const amount = portfolio[symbol]
                const value = amount * prices[symbol]
                table.push([symbol, amount, value])
              }
            }
            cli.action.stop()
            this.log(table.toString())
          })
        } else {
          this.log('Sorry, said exchange is not supported or configured.')
        }
      } else {
        if (userConfig[flags.exchange]) {
          cli.action.start(`Loading portfolio from ${this.capitalize(flags.exchange)}`)
          let table = new Table({
            head: ['Cryptocurrency', 'Amount'],
          })
          const ExchangeClass = ccxt[flags.exchange]
          const config = userConfig[flags.exchange]
          const exchangeClass = new ExchangeClass({
            apiKey: config.apiKey,
            secret: config.secret,
            timeout: 30000,
            enableRateLimit: true,
          })
          exchangeClass.fetchBalance().then(({total}) => {
            for (const symbol in total) {
              if (total[symbol] > 0) {
                table.push([symbol, total[symbol]])
              }
            }
            cli.action.stop()
            this.log(table.toString())
          }).catch(error => {
            this.error(error.toString())
            this.log(`Exchange '${flags.exchange}' returned an error, please try again.`)
          })
        } else {
          this.log('Sorry, said exchange is not supported or configured.')
        }
      }
    } else {
      for (const exchange in userConfig) {
        if ({}.hasOwnProperty.call(userConfig, exchange)) {
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
      }

      if (flags.detailed) {
        this.log('Fetching detailed portfolio...')
        let globalPortfolio = {}
        const tasks = exchanges.map(obj => {
          return {
            title: this.capitalize(obj.exchange),
            task: () =>
              obj.eClass.fetchBalance().then(({total}) => {
                const name = obj.exchange
                let portfolio = {}
                for (const currency in total) {
                  if (total[currency] > 0) {
                    portfolio[currency] = total[currency]
                  }
                }
                globalPortfolio[name] = portfolio
              }).catch(error => {
                throw error
              }),
          }
        })
        table = new Table({
          head: ['Cryptocurrency', 'Exchange', 'Amount', 'Value'],
        })
        const fetchPortfolio = new Listr(tasks, {concurrent: true, exitOnError: false}).run()
        new Listr([
          {
            title: 'Fetching portfolio',
            task: () => fetchPortfolio,
          },
          {
            title: 'Fetching prices',
            task: ctx => {
              Object.keys(globalPortfolio).map(exchange => {
                Object.keys(exchange).map(async symbol => {
                  const ticker = await coinTicker(exchange, symbol)
                  ctx.values[exchange][symbol] = this.average(ticker)
                })
                return 0
              })
            },
          },
        ]).run().then(result => {
          const averages = result.values
          // push values to table
          this.log(table.toString())
        }).catch(error => {
          this.log(error)
        })
      } else {
        this.log('Fetching portfolio...')
        const tasks = exchanges.map(obj => {
          return {
            title: this.capitalize(obj.exchange),
            task: ctx =>
              obj.eClass.fetchBalance().then(({total}) => {
                const name = obj.exchange
                let portfolio = {}
                for (const currency in total) {
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
        table = new Table({
          head: ['Cryptocurrency', 'Exchange', 'Amount'],
        })
        new Listr(tasks, {concurrent: true, exitOnError: false})
        .run().then(context => {
          // push it to table now
          for (const exchange in context) {
            if ({}.hasOwnProperty.call(context, exchange)) {
              const portfolio = context[exchange]
              for (const symbol in portfolio) {
                if ({}.hasOwnProperty.call(portfolio, symbol)) {
                  table.push([symbol, this.capitalize(exchange), portfolio[symbol]])
                }
              }
            }
          }
          this.log(table.toString())
        }).catch(error => {
          const {context} = error
          for (const exchange in context) {
            if ({}.hasOwnProperty.call(context, exchange)) {
              const portfolio = context[exchange]
              for (const symbol in portfolio) {
                if ({}.hasOwnProperty.call(portfolio, symbol)) {
                  table.push([symbol, this.capitalize(exchange), portfolio[symbol]])
                }
              }
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

  average(ticker) {
    return (parseFloat(ticker.high) + parseFloat(ticker.low)) / 2
  }
}

DashCommand.description = `
Display user portfolio in tabular form
`

DashCommand.flags = {
  detailed: flags.boolean({char: 'd', description: 'Detailed portfolio with values across exchanges'}),
  exchange: flags.string({char: 'e', description: 'The exchange to fetch the data from'}),
}

module.exports = DashCommand
