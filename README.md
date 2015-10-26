## domain-correction

Provide suggested corrections to misspelt email domain names

### Installation

    npm install domain-correction

### Usage

```js
const domainCorrection = require('domain-correction');

// pass options to get a function to use
const correct = domainCorrection(/* additionalHosts = [], includeDefaults = true, maxEditDistance = 3 */);

// pass in user input to get suggested changes
correct('gmai.com');       // 'gmail.com'
correct('hotamil.fr');     // 'hotmail.fr'
correct('foobarmail.com'); // 'foobarmail.com'
correct('OuTlOoK.com');    // 'outlook.com'
correct('aol.com');        // 'aol.com'
```

### Development

- **make compile** to compile source code from ES6 to ES5
- **make test** to run tests
- **make lint** to lint files
- **make watch** to automatically watch source directory for changes
- **make coverage** to run the tests with a coverage report
- **make view-coverage** to open the detailed report in your browser

#### Deployment

1. Create a release.
  - Run `make compile`
  - Update `package.json` to increment the version number.
  - Update `History.md`
  - Commit this change.
2. Create a tag.
  - `git tag -a v1.2.3`
3. Push changes
  - `git push --follow-tags origin master`
4. Publish to npm
  - `npm publish`
