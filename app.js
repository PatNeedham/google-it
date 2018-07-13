#! /usr/bin/env node

const ora = require('ora')
const theSpinner = ora({text: 'Loading results', color: 'cyan'}).start()
const commandLineArgs = require('command-line-args')
const validateCLIArguments = require('./validateCLIArguments')
const googleIt = require('./googleIt')
const optionDefinitions = require('./optionDefinitions')
var cli_options = commandLineArgs(optionDefinitions)

// first arg is 'node', second is /path/to/file/app.js, third is whatever follows afterward
if (process.argv.length > 2) {
  cli_options['query'] = process.argv[2]
}
var validation = validateCLIArguments(cli_options)

if (!validation.valid) {
  console.log("Invalid options. Error: " + validation.error)
  theSpinner.clear()
} else {
  googleIt(cli_options)
    .then(() => {
      theSpinner.stop()
      theSpinner.clear()
    })
    .catch(err => console.err(err))
}
