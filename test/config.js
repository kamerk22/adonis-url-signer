'use strict '

module.exports = {
  signatureKey: Math.random()
    .toString(36)
    .substring(7),
  defaultExpirationTimeInHour: 24,
  options: {
    expires: 'expires',
    signature: 'signature'
  }
}
