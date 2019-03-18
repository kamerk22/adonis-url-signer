'use strict'

/**
 *
 * adonis-url-signer
 * Copyright(c) Kashyap Merai <kashyapk62@gmail.com>
 * MIT Licensed
 *
 */

const { ServiceProvider } = require('@adonisjs/fold')

class UrlSignerProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Sophos', app => {
      const Config = app.use('Adonis/Src/Config')
      const UrlSigner = require('../src/UrlSigner')

      return new UrlSigner(Config)
    })

    this.app.alias('Adonis/Addons/UrlSigner', 'UrlSigner')
  }
}

module.exports = UrlSignerProvider
