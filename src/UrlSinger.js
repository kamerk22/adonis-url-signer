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
 * The UrlSigner class sign a request and generate a URL
 *
 * @class UrlSigner
 *
 * @param {Object} Config
 */
class UrlSigner {
  constructor (Config) {
    this.config = Config.merge('urlSigner', {
      signatureKey: this.signatureKey,
      defaultExpirationTimeInDays: this.defaultExpirationTimeInDays,
      options: this.options
    })
  }

  signRoute (url, parameter = {}, expiration = null) {
    let u = Url.parse(url, true)
    if (expiration) {
      parameter[this.config.options.expires] =
        Math.round(Date.now() / 1000) + expiration * 24 * 60 * 60
    }
    u.search = sortObject({
      ...u.query,
      ...parameter,
      [`${this.config.options.signature}`]: sign(
        u.format(),
        this.config.signatureKey
      )
    })
    return u.format()
  }

  temporarySignedRoute (
    url,
    parameter = {},
    expiration = this.config.defaultExpirationTimeInDays
  ) {
    return this.signRoute(url, parameter, expiration)
  }

  hasValidSignature (url) {
    let u = Url.parse(url, true)

    let query = u.query

    let signature = query[this.config.options.signature]

    let expires = query[this.config.options.expires]
    delete query[this.config.options.signature]
    u.search = Query.stringify(u.query)
    return (
      signature === sign(u.format(), this.config.signatureKey) &&
      !(expires && Math.round(Date.now() / 1000) > expires)
    )
  }
}

function sign (dataToSign, serect) {
  return crypto
    .createHmac('sha256', serect)
    .update(dataToSign)
    .digest('base64')
}
function sortObject (query) {
  return Object.keys(query)
    .sort()
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
    .join('&')
}

module.exports = UrlSigner
