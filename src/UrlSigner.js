'use strict'

/**
 *
 * adonis-url-signer
 * Copyright(c) Kashyap Merai <kashyapk62@gmail.com>
 * MIT Licensed
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
 * @param {Object} Config
 *
 */
class UrlSigner {
  constructor (Config) {
    this.config = Config.merge('urlSigner', {
      signatureKey: this.signatureKey,
      defaultExpirationTimeInHour: this.defaultExpirationTimeInHour,
      options: this.options
    })
  }

  /**
   * The sign function generate sign URL.
   *
   * @function sign
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
        throw new Error('Expiration time must be numeric.')
      }
      parameter[this.config.options.expires] =
        Math.round(Date.now() / 1000) + expiration * 60 * 60
    }
    u.search = sortObject({
      ...u.query,
      ...parameter
    })
    u.search += `&${[`${this.config.options.signature}`]}=${makeSign(
      u.format(),
      this.config.signatureKey
    )}`
    return u.format()
  }

  /**
   * The temporarySign function generate temporary sign URL.
   *
   * @function temporarySign
   * @param {string} url - URL to sign
   * @param {Object} parameter - Any additional parameter to include
   * @param {Number} expiration - Expiration in hours
   *
   * @return {String}
   *
   */
  temporarySign (
    url,
    parameter = {},
    expiration = this.config.defaultExpirationTimeInHour
  ) {
    return this.sign(url, parameter, expiration)
  }

  /**
   * The isValidSign function check the signature of given URL
   *
   * @function temporarySign
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
      signature === makeSign(u.format(), this.config.signatureKey) &&
      !(expires && Math.round(Date.now() / 1000) > expires)
    )
  }
}

/**
 * The makeSign function generate signature for
 * given payload using given serect key.
 *
 * @function makeSign
 * @param {Object} payload - The payload to include in sign
 * @param {String} serect - Key to use for generating HMAC
 *
 * @returns {String}
 *
 */
function makeSign (payload, serect) {
  return crypto
    .createHmac('sha256', serect)
    .update(payload)
    .digest('hex')
}

/**
 * The sortObject function sort all query params
 * and join them.
 *
 * @function sortObject
 * @param {Object} query - URL query string to sort
 *
 * @returns {String}
 *
 */
function sortObject (query) {
  return Object.keys(query)
    .sort()
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
    .join('&')
}

module.exports = UrlSigner
