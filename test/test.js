var assert = require('assert')
var validateCLIArguments = require('../validateCLIArguments')

describe('Validate output file format', () => {
  describe('# -o 12345', () => {
    it('should be invalid because output must be a string value', () => {
      assert.equal(
        validateCLIArguments({query: 'i dont know', output: 12345}).valid,
        false
      )
    })
  })
  describe('# -o whatever.jsonnn', () => {
    it('should be invalid because output file must end with .json', () => {
      assert.equal(
        validateCLIArguments({query: 'blah', output: 'whatever.jsonnn'}).valid,
        false
      )
    });
  });
});
