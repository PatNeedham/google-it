/* eslint-disable no-console */
const googleIt = require('../src/googleIt');

googleIt({ query: 'St. Vincent St. Mary Ohio', disableConsole: true }).then((results) => {
  // THIS console.log will display when running `node test/without_console_logs.js
  // but the color-coded results will NOT display in the terminal
  console.log(`the results here: ${JSON.stringify(results, null, 2)}`);
});
