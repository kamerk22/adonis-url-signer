'use strict'

/**
 *
 * adonis-url-signer
 * Copyright(c) Kashyap Merai <kashyapk62@gmail.com>
 * MIT Licensed
 *
 */

const { ServiceProvider } = require.main.require('@adonisjs/fold')

class UrlSignerProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/UrlSigner', () => {
      const Config = this.app.use('Adonis/Src/Config')
      const UrlSigner = require('../src/UrlSigner')
      return new UrlSigner(Config)
    })

    this.app.bind('Adonis/UrlSigner/Signed', () => {
      const Signed = require('../src/Middlewares/Signed')
      return new Signed()
    })
  }
}

module.exports = UrlSignerProvider
