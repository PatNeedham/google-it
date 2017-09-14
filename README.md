# google-it ![Travis-CI](https://travis-ci.org/PatNeedham/google-it.svg?branch=master)

A simple library to convert Google search results to JSON output, with an interactive display option coming in the near future.

## Install

`$ npm install --save -g google-it`

## Example Usage

`$ google-it "Latvian unicorn"`

![GIF of google-it](google-it-demo.gif?raw=true "google-it")

## Upcoming Features Roadmap

### Command Line Arguments
- [ ] *query* - the query that should be sent to the Google search
- [x] *output* - name of the JSON file to save results to
- [ ] *save* - name of the html file if you want to save the actual response from the html request (useful for debugging purposes)
- [x] *limit* - number of search results to be returned
- [ ] *verbose* - console.log useful statements to show what's currently taking place
- [ ] *interactive* - once results are returned, show them in an interactive prompt where user can scroll through them
- [ ] *bold-matching-text* - only takes effect when interactive (-i) flag is set as well, will bold test in results that matched the query
- [ ] *stackoverflow-github-only* - option to limit results to only these two sites

### Programmatic Use in NodeJS environment

- [ ] something like:

```
var googleIt = require('google-it')
googleIt('covfefe irony').then(results => {
  // access to results object here
}).catch(e => {
  // any possible errors that might have occurred (like no Internet connection)
})
```
