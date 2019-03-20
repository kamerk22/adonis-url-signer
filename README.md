# Create secured URLs with a limited lifetime in AdonisJs
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
<br/>
This library can create URLs with a limited lifetime in AdonisJs. This is acheive by adding an expiration date and a signature to the URL.

## Install
```js
npm install --save adonis-url-signer
```

## Configure
Register the urlSigner provider in start/app.js:
```js
const providers = [
  ...
  'adonis-url-signer/providers/UrlSignerProvider'
]
```
Register aliases of provider in start/app.js:
```js
const aliases = {
    ...
    UrlSigner: 'Adonis/UrlSigner'
}
```
Register named middleware in start/kernel.js:
```js
const namedMiddleware = {
  ...
  signed: 'Adonis/UrlSigner/Signed'
}
```

## Tests
Tests are written using [japa](http://github.com/thetutlage/japa). Run the following commands to run tests.
```bash
npm run test:local

# report coverage
npm run test

# on windows
npm run test:win
```


## Credits

- [Kashyap Merai](https://github.com/kamerk22)
- Special thanks to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such a great framework.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
