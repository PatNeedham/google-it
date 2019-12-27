import validateCLIArguments from '../src/validateCLIArguments';

describe('Validate output file format', () => {
  describe('# -o 12345', () => {
    it('should be invalid because output must be a string value', () => {
      const result = validateCLIArguments({ query: 'i dont know', output: 12345 });
      expect(result.valid).toBe(false);
    });
  });
  describe('# -o whatever.jsonnn', () => {
    it('should be invalid because output file must end with .json', () => {
      const result = validateCLIArguments({ query: 'blah', output: 'whatever.jsonnn' });
      expect(result.valid).toBe(false);
    });
  });
  describe('# -n', () => {
    it('should be invalid because --no-display can only be used with --output', () => {
      const result = validateCLIArguments({ query: 'blah', 'no-display': true });
      expect(result.valid).toBe(false);
    });
  });
  it('returns error as "Missing query" when query is not passed as argument', () => {
    const result = validateCLIArguments({});
    expect(result.Error).toBe('Missing query');
  });
  it('returns { valid: true } when argument is formatted correctly', () => {
    const result = validateCLIArguments({ query: 'best' });
    expect(result.valid).toBe(true);
  });
});
