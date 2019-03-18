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
    this.app.singleton('Adonis/Addons/UrlSinger', () => {
      const Config = this.app.use('Adonis/Src/Config')
      const UrlSigner = require('../src/UrlSinger')
      return new UrlSigner(Config)
    })
  }
}

module.exports = UrlSignerProvider
