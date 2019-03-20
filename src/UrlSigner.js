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

const crypto = require('crypto')

const Query = require('querystring')

const Url = require('url')

/**
 * The UrlSigner class can generate sign, temporary sign
 * URL. Can check for valid sign.
 *
 * @class
 * @constructor
 *
 */
class UrlSigner {
  constructor (Config) {
    this.config = Config.merge('urlSigner')
  }

  /**
   * The sign method generate sign URL.
   *
   * @method sign
   * @param {string} url - URL to sign
   * @param {Object} parameter - Any additional parameter to include
   * @param {Number} expiration - Expiration in hours
   * @throws {Error}
   *
   * @return {String}
   *
   */
  sign (url, parameter = {}, expiration = null) {
    let u = Url.parse(url, true)
    if (expiration) {
      if (isNaN(expiration)) {
        var error = new Error(
          'Invalid Argument: Expiration time must be numeric.'
        )
        error.status = 422
        throw error
      }
      parameter[this.config.options.expires] =
        Math.round(Date.now() / 1000) + expiration * 60 * 60
    }
    u.search = this._sortObject({
      ...u.query,
      ...parameter
    })
    u.search += `&${[`${this.config.options.signature}`]}=${this._makeSign(
      u.format(),
      this.config.signatureKey
    )}`
    return u.format()
  }

  /**
   * The temporarySign method generate temporary sign URL.
   *
   * @method temporarySign
   * @param {string} url - URL to sign
   * @param {Number} expiration - Expiration in hours
   * @param {Object} parameter - Any additional parameter to include
   *
   * @return {String}
   *
   */
  temporarySign (
    url,
    expiration = this.config.defaultExpirationTimeInHour,
    parameter = {}
  ) {
    return this.sign(url, parameter, expiration)
  }

  /**
   * The isValidSign method check the signature of given URL
   *
   * @method temporarySign
   * @param {string} url - URL to sign
   *
   * @return {Boolean}
   *
   */
  isValidSign (url) {
    let u = Url.parse(url, true)

    let query = u.query

    let signature = query[this.config.options.signature]

    let expires = query[this.config.options.expires]
    delete query[this.config.options.signature]
    u.search = Query.stringify(u.query)
    return (
      signature === this._makeSign(u.format(), this.config.signatureKey) &&
      !(expires && Math.round(Date.now() / 1000) > expires)
    )
  }

  /**
   * The _makeSign method generate signature for
   * given payload using given serect key.
   *
   * @private
   * @method _makeSign
   * @param {Object} payload - The payload to include in sign
   * @param {String} serect - Key to use for generating HMAC
   *
   * @returns {String}
   *
   */
  _makeSign (payload, serect) {
    return crypto
      .createHmac('sha256', serect)
      .update(payload)
      .digest('hex')
  }

  /**
   * The _sortObject method sort all query params
   * and join them.
   *
   *
   * @private
   * @method _sortObject
   * @param {Object} query - URL query string to sort
   *
   * @returns {String}
   *
   */
  _sortObject (query) {
    return Object.keys(query)
      .sort()
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
      .join('&')
  }
}

module.exports = UrlSigner
