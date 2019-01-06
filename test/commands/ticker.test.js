const {expect, test} = require('@oclif/test')

describe('ticker', () => {
  test
  .stdout()
  .command(['coin ticker unsupported-exchange btc'])
  .it('complains about unsupported exchange', ctx => {
    expect(ctx.stdout).to.contain('Unsupported exchange')
  })

  test
  .stdout()
  .command(['coin ticker kraken'])
  .it('complains about missing symbol', ctx => {
    expect(ctx.stdout).to.contain('Missing symbol')
  })
})
