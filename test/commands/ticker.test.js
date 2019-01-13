const {expect, test} = require('@oclif/test')

describe('ticker', () => {
  test
  .stdout()
  .command(['ticker', 'unsupported-exchange', 'btc'])
  .it('complains about unsupported exchange', ctx => {
    expect(ctx.stdout).to.contain('unsupported')
  })

  test
  .stdout()
  .command(['ticker', 'binance'])
  .it('complains about missing symbol/exchange', ctx => {
    expect(ctx.stdout).to.contain('missing')
  })

  test
  .stdout()
  .command(['ticker', 'binance', 'bad-symbol'])
  .it('binance: complains about symbol not being found on exchange', ctx => {
    expect(ctx.stdout).to.contain('The symbol appears to be unsupported, please check it and try again.')
  })
})
