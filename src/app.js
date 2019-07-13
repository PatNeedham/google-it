#! /usr/bin/env node

/* eslint-disable no-console */

const ora = require('ora');

const theSpinner = ora({ text: 'Loading results', color: 'cyan' }).start();
const commandLineArgs = require('command-line-args');
const validateCLIArguments = require('./validateCLIArguments');
const googleIt = require('./googleIt');
const optionDefinitions = require('./optionDefinitions');

const cliOptions = commandLineArgs(optionDefinitions);

// first arg is 'node', second is /path/to/file/app.js, third is whatever follows afterward
if (process.argv.length > 2) {
  // eslint-disable-next-line prefer-destructuring
  cliOptions.query = process.argv[2];
}
const validation = validateCLIArguments(cliOptions);

if (!validation.valid) {
  console.log(`Invalid options. Error:  ${validation.error}`);
  theSpinner.clear();
} else {
  googleIt(cliOptions)
    .then(() => {
      theSpinner.stop();
      theSpinner.clear();
    })
    .catch(err => console.err(err));
}
