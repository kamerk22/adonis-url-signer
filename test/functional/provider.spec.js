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

const path = require('path')
const { ioc, registrar } = require('@adonisjs/fold')
const test = require('japa')
const { Config } = require('@adonisjs/sink')
const urlSignerConfig = require('../config')

test.group('Providers', group => {
  test('UrlSignerProvider', async assert => {
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()
      config.set('urlSigner', urlSignerConfig)
      return config
    })
    ioc.alias('Adonis/Src/Config', 'Config')
    await registrar
      .providers([path.join(__dirname, '../../providers/UrlSignerProvider')])
      .registerAndBoot()

    assert.isDefined(ioc.use('Adonis/UrlSigner'))
    assert.isTrue(ioc._bindings['Adonis/UrlSigner'].singleton)

    assert.isDefined(ioc.use('Adonis/UrlSigner/Signed'))
    assert.isTrue(ioc._bindings['Adonis/UrlSigner/Signed'].singleton)
  })
})
