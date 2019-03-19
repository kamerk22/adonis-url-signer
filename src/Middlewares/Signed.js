'use strict'

/**
 *
 * adonis-url-signer
 * Copyright(c) Kashyap Merai <kashyapk62@gmail.com>
 * MIT Licensed
 *
 */

const UrlSigner = use('Adonis/Addons/UrlSinger')

class Signed {
  async handle ({ request }, next) {
    let isAllowed = UrlSigner.isValidSign(
      request.protocol() +
        '://' +
        request.header('host') +
        request.originalUrl()
    )
    if (!isAllowed) {
      throw new Error(403)
    }
    await next()
  }
}

module.exports = Signed
