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
  .command(['ticker', 'kraken'])
  .it('complains about missing symbol/exchange', ctx => {
    expect(ctx.stdout).to.contain('missing')
  })
})
