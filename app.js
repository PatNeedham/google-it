#! /usr/bin/env node

const ora = require('ora')
const spinner = ora({text: 'Loading results', color: 'cyan'}).start();
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
  spinner.stop()
} else {
  googleIt(cli_options, (err, results) => {
    spinner.stop()
    if (err) {
      console.err(err)
    }
  })
}
