# google-it ![Travis-CI](https://travis-ci.org/PatNeedham/google-it.svg?branch=master)

A simple library to convert Google search results to JSON output, with an interactive display option coming in the near future.

## Install

`$ npm install --save -g google-it`

## Example Usage

`$ google-it "Latvian unicorn"`

![GIF of google-it](google-it-demo.gif?raw=true "google-it")

Prevent display in the terminal, and save results to a JSON file:

`$ google-it "PWAs with react-router and redux" -o results.json -n`

![GIF of google-it w/o display, results saved to file](google-it-output-no-display.gif?raw=true "google-it")

## Upcoming Features Roadmap

### Command Line Arguments
- [x] *query* - the query that should be sent to the Google search
- [x] *output* - name of the JSON file to save results to
- [x] *no-display* - prevent results from appearing in the terminal output. Should only be used with --output (-o) command when saving results to a file
- [ ] *save* - name of the html file if you want to save the actual response from the html request (useful for debugging purposes)
- [x] *limit* - number of search results to be returned
- [ ] *verbose* - console.log useful statements to show what's currently taking place
- [ ] *interactive* - once results are returned, show them in an interactive prompt where user can scroll through them
- [ ] *bold-matching-text* - only takes effect when interactive (-i) flag is set as well, will bold test in results that matched the query
- [ ] *stackoverflow-github-only* - option to limit results to only these two sites

### Programmatic Use in NodeJS environment

- [ ] something like:

```js
const  googleIt = require('google-it')

googleIt({'query': 'covfefe irony'}).then(results => {
  // access to results object here
}).catch(e => {
  // any possible errors that might have occurred (like no Internet connection)
})

// with request options
const options = {
  'proxy': 'http://localhost:8118'
};
googleIt({options, 'query': 'covfefe irony'}).then(results => {
  // access to results object here
}).catch(e => {
  // any possible errors that might have occurred (like no Internet connection)
})
```
