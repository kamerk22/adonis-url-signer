'use strict'

const path = require('path')

module.exports = async cli => {
  try {
    const fromPath = path.join(__dirname, 'config/index.js')
    const toPath = path.join(cli.helpers.configPath(), 'urlSigner.js')
    await cli.copy(fromPath, toPath)
    cli.command.completed('create', 'config/urlSigner.js')
  } catch (error) {
    cli.command.info(
      'config/urlSigner.js already exists. Copy the config file from the following url'
    )
    console.log('https://github.com/kamerk22/adonis-url-signer/blob/master/config/index.js')
  }
}
