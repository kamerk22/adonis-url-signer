'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Signature Key
  |--------------------------------------------------------------------------
  |
  | Signature key is a randomly generated 16 or 32 characters long string required
  | to encrypt cookies, sessions and other sensitive data.
  |
  */

  signatureKey: Env.getOrFail('APP_KEY'),

  /*
  |--------------------------------------------------------------------------
  | Default Expiry Time in Hours
  |--------------------------------------------------------------------------
  |
  | The default expiration time of a URL in hours.
  |
  */

  defaultExpirationTimeInHour: 24,

  /*
  |--------------------------------------------------------------------------
  | Options
  |--------------------------------------------------------------------------
  |
  | These strings are used as a options names in a signed url.
  |
  */
  options: {
    expires: 'expires',
    signature: 'signature'
  }
}
