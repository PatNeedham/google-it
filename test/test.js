var assert = require('assert')
var googleIt = require('../googleIt')
var validateCLIArguments = require('../validateCLIArguments')
var optionDefinitions = require('../optionDefinitions')

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
  describe('# -n', () => {
    it('should be invalid because --no-display can only be used with --output', () => {
      assert.equal(
        validateCLIArguments({'query': 'blah', 'no-display': true}).valid,
        false
      )
    })
  })
});

describe('Ensure programmatic access works', () => {
  it('Should have results that exist', (done) => {
    var options = {
      "query": "Statue of liberty",
      "no-display": true
    }
    googleIt(options).then(results => {
      assert.notEqual(results, null, "Results must exist")
      done()
    }).catch(err => {
      done(err)
    })
  })
})