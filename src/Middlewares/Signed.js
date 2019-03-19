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

const UrlSigner = use('Adonis/UrlSigner')

/**
 * The Signed class can verify incoming request
 * for valid signature and expiry.
 *
 * @class
 * @throws {Error}
 *
 */
class Signed {
  async handle ({ request }, next) {
    let isAllowed = UrlSigner.isValidSign(
      request.protocol() +
        '://' +
        request.header('host') +
        request.originalUrl()
    )
    if (!isAllowed) {
      var error = new Error('Forbridden: Access Denied.')
      error.status = 403
      throw error
    }
    await next()
  }
}

module.exports = Signed
