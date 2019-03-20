# Create secured URLs with a limited lifetime in AdonisJs
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
<br/>

This library allows you to easily create "signed" URLs. These URLs have a "signature" hash appended as query string so we can easily verify that it's not manipulated.

For example, you might use signed URLs to implement "password reset link" which is valid for couple of hours only.

## Install
```js
npm install --save adonis-url-signer
```

## Setup
Register the urlSigner provider in `start/app.js`:
```js
const providers = [
    ...
    'adonis-url-signer/providers/UrlSignerProvider'
]
```
Register aliases of provider in `start/app.js`:
```js
const aliases = {
    ...
    UrlSigner: 'Adonis/UrlSigner'
}
```

## Config
Configuration is defined inside a file `config/urlSigner.js`
```js
const Env = use('Env')

module.exports = {
    signatureKey: Env.getOrFail('APP_KEY'),
    defaultExpirationTimeInHour: 24,
    options: {
        expires: 'expires',
        signature: 'signature'
    }
}
```

## Usage
 To create a signed URL, use the `sign` method of the `UrlSigner`.
 ```js
 const UrlSigner = use("UrlSigner");

 return UrlSigner.sign("http://secured.domain/sign", { user: 1 })

// http://secured.domain/sign/?user=1&signature=xxxxxxxxxxx
 ```
You can also generate a temporary signed URL that expires, you may use the  `temporarySign` method. You need to pass expiration in hour:
```js
const UrlSigner = use("UrlSigner");

return UrlSigner.temporarySign('http://secured.domain/tempSigner', 24, { user : 1 });

// http://secured.domain/sign/?expiry=1553106418&user=1&signature=xxxxxxxxxxx
```

## Validating Incoming Request
To verify incoming request has valid signature, you should call `isValidSign` method.
```js
const UrlSigner = use("UrlSigner");

Route.get("/sign", ({ request }) => {
    const url = request.protocol() + "://" + request.header("host") + request.originalUrl();
    if (!UrlSigner.isValidSign(url)) {
        // 403 Forbridden
    }
    ...
});
```
Alternative you can also use `signed` middleware to validate incoming request.
Register named middleware in `start/kernel.js`:
```js
const namedMiddleware = {
    ...
    signed: 'Adonis/UrlSigner/Signed'
}
```
After registing middleware in you kernel, you may use that middleware in you route. If incoming request does not have a valid signature, the middleware will automatically throw an error 403 `Forbridden: Access Denied`:
```js
const UrlSigner = use("UrlSigner");

Route.get("/sign", ({ request }) => {
    // ...
}).middleware("signed");
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

## Support

Having trouble? [Open an issue](https://github.com/kamerk22/adonis-url-signer/issues/new)!

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
