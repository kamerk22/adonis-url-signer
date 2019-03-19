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

const { ServiceProvider } = require.main.require('@adonisjs/fold')

class UrlSignerProvider extends ServiceProvider {
  /**
   * Register provider under `Adonis/UrlSigner`
   * namespace
   *
   * @method _registerProvider
   *
   * @return {void}
   */
  _registerProvider () {
    this.app.singleton('Adonis/UrlSigner', app => {
      const UrlSigner = require('../src/UrlSigner')
      return new UrlSigner(app.use('Adonis/Src/Config'))
    })
  }

  /**
   * Register middleware under `Adonis/UrlSigner/Signed`
   * namespace
   *
   * @method _registerMiddleware
   *
   * @return {void}
   */
  _registerMiddleware () {
    this.app.singleton('Adonis/UrlSigner/Signed', () => {
      const Signed = require('../src/Middlewares/Signed')
      return new Signed()
    })
  }
  /**
   * Register the provider and the middleware
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this._registerProvider()
    this._registerMiddleware()
  }
}

module.exports = UrlSignerProvider
