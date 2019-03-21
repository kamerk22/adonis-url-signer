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

const semver = require('semver')
const { spawn } = require('child_process')
const spawnArgs = []

if (semver.lt(process.version, '8.0.0')) {
  spawnArgs.push('--harmony-async-await')
}

function test () {
  spawnArgs.push('japaFile.js')
  const tests = spawn('node', spawnArgs)
  tests.stdout.on('data', (data) => process.stdout.write(data))
  tests.stderr.on('data', (data) => process.stderr.write(data))
  tests.on('close', (code) => process.exit(code))
}

test()
