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
    try {
      userConfig = fs.readJsonSync(path.join(this.config.configDir, 'config.json'))
    } catch (error) {
      this.exit('Cannot find / read config file')
    }
    if (flags.exchange) {
      if (flags.detailed) {
        const exchange = flags.exchange
        if (userConfig[exchange]) {
          let table = new Table({
            head: ['Symbol', 'Amount', 'Value(USD)'],
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
              task: context => exchangeClass.fetchBalance().then(({total}) => {
                let portfolio = {}
                for (const symbol in total) {
                  if (total[symbol] > 0) {
                    portfolio[symbol] = total[symbol]
                  }
                }
                context.portfolio = portfolio
              }),
            },
            {
              title: 'Fetch prices',
              task: context => Promise.all(Object.keys(context.portfolio).map(symbol => {
                return coinTicker(exchange, symbol + '_' + CUR)
              })).then(result => {
                context.prices = result
              }),
            },
          ], {concurrent: false}).run({}).then(result => {
            const {portfolio, prices} = result
            const priceDic = prices.reduce((accumulator, currentValue) => {
              const symbol = currentValue.pair.split('_')[0]
              accumulator[symbol] = currentValue
              return accumulator
            }, {})
            let sum = 0
            for (const symbol in portfolio) {
              if ({}.hasOwnProperty.call(portfolio, symbol)) {
                const amount = portfolio[symbol]
                const value = amount * this.average(priceDic[symbol])
                sum += value
                table.push([symbol, amount, value.toFixed(2)])
              }
            }
            table.push(['Total', '', sum.toFixed(2)])
            this.log(table.toString())
          }).catch(error => this.log(error))
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
      let exchanges = []
      for (const exchange in userConfig) {
        if ({}.hasOwnProperty.call(userConfig, exchange)) {
          const ExchangeClass = ccxt[exchange]
          const config = userConfig[exchange]
          exchanges.push(new ExchangeClass({
            apiKey: config.apiKey,
            secret: config.secret,
            timeout: 30000,
            enableRateLimit: true,
          }))
        }
      }

      if (flags.detailed) {
        this.log('Fetching detailed portfolio...')
        table = new Table({
          head: ['Cryptocurrency', 'Exchange', 'Amount', 'Value(USD)'],
        })
        new Listr([
          {
            title: 'Fetch portfolio',
            task: ctx => Promise.all(exchanges.map(exchange =>
              exchange.fetchBalance()
            )).then(result => {
              let portfolio = {}
              for (var i = 0; i < exchanges.length; i++) {
                const exchangeName = exchanges[i].name.toLowerCase()
                portfolio[exchangeName] = result[i].total
              }
              ctx.portfolio = portfolio
            }),
          },
          {
            title: 'Fetch prices',
            task: ctx => Promise.all(Object.keys(ctx.portfolio).map(exchange => {
              const coins = ctx.portfolio[exchange]
              return Promise.all(Object.keys(coins).filter(coin => coins[coin] > 0).map(symbol => coinTicker(exchange, symbol.toUpperCase() + '_' + CUR)
              ))
            })).then(result => {
              ctx.prices = result
            }).catch(error => {
              throw error
            }),
          },
        ]).run({}).then(result => {
          const {prices, portfolio} = result
          // convert prices to a more amenable format
          const gPrices = prices.reduce((accumulator, currentValue) => {
            accumulator[currentValue[0].exchange] = currentValue
            return accumulator
          }, {})
          let averages = {}
          for (const exchange in gPrices) {
            if ({}.hasOwnProperty.call(gPrices, exchange)) {
              // do something
              const values = gPrices[exchange]
              averages[exchange] = values.reduce((accumulator, currentValue, currentIndex) => {
                let symbol = null
                try {
                  symbol = currentValue.pair.split('_')[0]
                } catch (error) {
                  this.error(`Exchange ${exchanges[currentIndex].name} returned incompatible data, cannot proceed.`)
                }
                const average = this.average(currentValue)
                accumulator[symbol] = average
                return accumulator
              }, {})
            }
          }
          let sum = 0
          for (const exchange in portfolio) {
            if ({}.hasOwnProperty.call(portfolio, exchange)) {
              const values = averages[exchange]
              const subPortfolio = portfolio[exchange]
              for (const symbol in subPortfolio) {
                // do something
                if ({}.hasOwnProperty.call(subPortfolio, symbol)) {
                  const averagePrice = values[symbol]
                  const amount = subPortfolio[symbol]
                  const value = amount * averagePrice
                  sum += value
                  table.push([symbol, exchange, amount, value.toFixed(2)])
                }
              }
            }
          }
          table.push(['Total', '', '', sum.toFixed(2)])
          this.log(table.toString())
        }).catch(error => {
          this.log(error)
        })
      } else {
        this.log('Fetching portfolio...')
        const tasks = exchanges.map(exchange => {
          return {
            title: exchange.name,
            task: ctx =>
              exchange.fetchBalance().then(({total}) => {
                const name = exchange.name.toLowerCase()
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
        .run({}).then(context => {
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

DashCommand.description = `Display user portfolio in tabular form
`

DashCommand.flags = {
  detailed: flags.boolean({char: 'D', description: 'Detailed portfolio with values across exchanges'}),
  exchange: flags.string({char: 'e', description: 'The exchange to fetch the data from'}),
}

module.exports = DashCommand
