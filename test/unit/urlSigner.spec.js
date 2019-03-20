'use strict'

/**
 *
 * adonis-url-signer
 * Copyright(c) Kashyap Merai <kashyapk62@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source co
 *
 */

const test = require('japa')
const { ioc } = require('@adonisjs/fold')
const { setupResolver, Config } = require('@adonisjs/sink')
const Url = require('url')
const urlSignerConfig = require('../config')
const URL = 'http://localhost:3333'

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
    let u = Url.parse(urlSigner.sign(URL), true)
    assert.notEqual(u.query[urlSignerConfig.options.signature], undefined)
    assert.equal(u.query[urlSignerConfig.options.expires], undefined)
  })

  test('should return temporary sign url', assert => {
    const urlSigner = use('UrlSigner')
    let u = Url.parse(urlSigner.temporarySign(URL), true)
    assert.notEqual(u.query[urlSignerConfig.options.signature], undefined)
    assert.notEqual(u.query[urlSignerConfig.options.expires], undefined)
  })

  test('should return custom query params', assert => {
    const urlSigner = use('UrlSigner')
    let customParams = {
      foo: 'bar',
      params: {
        ok: 'np'
      }
    }
    let u = Url.parse(urlSigner.temporarySign(URL, customParams), true)
    assert.isTrue(urlSigner.isValidSign(u.format()))
    Object.keys(customParams).forEach(k => {
      assert.equal(customParams[k], u.query[k])
      assert.notEqual(u.query[k], undefined)
    })
  })

  test('should check valid signature', assert => {
    const urlSigner = use('UrlSigner')
    let u = Url.parse(urlSigner.temporarySign(URL), true)
    assert.isTrue(urlSigner.isValidSign(u.format()))
    assert.isFalse(urlSigner.isValidSign(u + 'playing_with_signature'))
  })

  test('should fail if signature is expired', assert => {
    const urlSigner = use('UrlSigner')
    let u = Url.parse(urlSigner.temporarySign(URL, {}, -1), true)
    assert.isFalse(urlSigner.isValidSign(u.format()))
  })

  test('should return valid expiry time', assert => {
    const urlSigner = use('UrlSigner')
    let u = Url.parse(urlSigner.temporarySign(URL, {}, 1), true)
    let now = Math.round(Date.now() / 1000)
    assert.isTrue(u.query[urlSignerConfig.options.expires] > now)
    assert.isTrue(u.query[urlSignerConfig.options.expires] <= now + 60 * 60)
  })

  test('should throw exception if expiration is invalid', assert => {
    const urlSigner = use('UrlSigner')
    assert.throws(
      () => urlSigner.temporarySign(URL, {}, 'invalidHour'),
      'Invalid Argument: Expiration time must be numeric.'
    )
  })
})
