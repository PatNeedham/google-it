const assert = require('assert');
const parseCommandLineArgs = require('../src/parseCommandLineArgs');

describe('parseCommandLineArgs', () => {
  it('only sets query option when argv.length === 3', () => {
    const argv = ['node', '/path/to/file/app.js', 'my search term'];
    assert.deepEqual(parseCommandLineArgs(argv), { query: 'my search term' });
  });
});
