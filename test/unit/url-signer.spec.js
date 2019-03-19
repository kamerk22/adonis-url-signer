const test = require('japa')
const { ioc } = require('@adonisjs/fold')
const { setupResolver, Config } = require('@adonisjs/sink')
const Url = require('url')
const urlSignerConfig = require('./config')

test.group('UrlSigner', group => {
  group.before(async () => {
    ioc.singleton('Adonis/UrlSigner', () => {
      const config = new Config()
      config.set('urlSigner', urlSignerConfig)
      return new (require('../../src/UrlSigner'))(config)
    })
    ioc.alias('Adonis/UrlSigner', 'UrlSigner')
    setupResolver()
  })

  group.beforeEach(() => {
    ioc.restore()
  })

  test('should add signature in query string', assert => {
    const urlSigner = use('UrlSigner')
    const URL = 'http://localhost:3333'
    let u = Url.parse(urlSigner.sign(URL), true)
    assert.notEqual(u.query[urlSignerConfig.options.signature], undefined)
  })

  test('should return temporary sign url', assert => {
    const urlSigner = use('UrlSigner')
    const URL = 'http://localhost:3333'
    assert.isString(urlSigner.sign(URL))
  })
})
