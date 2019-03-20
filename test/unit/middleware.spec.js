const test = require('japa')
const { ioc } = require('@adonisjs/fold')
const { setupResolver, Config } = require('@adonisjs/sink')
const Url = require('url')
const urlSignerConfig = require('./config')
const URL = 'http://localhost:3333'

test.group('Signed Middleware', group => {
  group.before(async () => {
    ioc.singleton('Adonis/UrlSigner', () => {
      const config = new Config()
      config.set('urlSigner', urlSignerConfig)
      return new (require('../../src/UrlSigner'))(config)
    })
    ioc.singleton('Adonis/UrlSigner/Signed', () => {
      const Signed = require('../../src/Middlewares/Signed')
      return new Signed()
    })
    ioc.alias('Adonis/UrlSigner', 'UrlSigner')
    ioc.alias('Adonis/UrlSigner/Signed', 'Signed')
    setupResolver()
  })

  group.beforeEach(() => {
    ioc.restore()
  })

  test('should allow if signature valid', async assert => {
    const urlSigner = use('UrlSigner')
    let u = Url.parse(urlSigner.temporarySign(URL), true)
    const signed = use('Signed')
    const fakeRequest = {
      request: {
        protocol () {
          return 'http'
        },
        originalUrl () {
          return `/${u.search}`
        },
        header () {
          return 'localhost:3333'
        }
      }
    }
    try {
      await signed.handle(fakeRequest, () => {
        return assert.isTrue(true)
      })
    } catch ({ message }) {
      assert.equal(message, 'Forbridden: Access Denied.')
    }
  })

  test('should throw exception if signature is invalid', async assert => {
    const signed = use('Signed')
    const fakeRequest = {
      request: {
        protocol () {
          return 'http'
        },
        originalUrl () {
          return '/signed'
        },
        header () {
          return 'localhost:3333'
        }
      }
    }
    assert.plan(1)
    try {
      await signed.handle(fakeRequest)
    } catch ({ message }) {
      assert.equal(message, 'Forbridden: Access Denied.')
    }
  })
})
