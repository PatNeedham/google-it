function validateCLIArguments(args) {
  if (!args['query']) {
    return {
      valid: false,
      'Error': 'Missing query'
    }
  } else if (args['output'] && typeof args['output'] !== 'string') {
    return {
      valid: false,
      'Error': 'output argument must be string'
    }
  } else if (args['output'] && !args['output'].endsWith('.json')) {
    return {
      valid: false,
      'Error': 'output argument must end in .json'
    }
  } else if (args['no-display'] && !args['output']) {
    return {
      valid: false,
      'Error': 'can only use --no-display when --output is used as well'
    }
  } else {
    return {
      valid: true
    }
  }
}

module.exports = validateCLIArguments
