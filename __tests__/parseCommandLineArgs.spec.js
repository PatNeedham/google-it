import commandLineArgs from 'command-line-args';
import parseCommandLineArgs from '../src/parseCommandLineArgs';

jest.mock('command-line-args', () => jest.fn(() => ({ query: 'foo' })));

describe('parseCommandLineArgs', () => {
  it('returns object with only "query" field when argv.length is 3', () => {
    const result = parseCommandLineArgs(['node', '/some/random/path', 'my query']);
    expect(result).toEqual({
      query: 'my query',
    });
  });

  it('calls commandLineArgs when argv.length is something other than 3', () => {
    parseCommandLineArgs(['node', '/some/random/path', 'my query', 'cinco de mayo']);
    expect(commandLineArgs).toHaveBeenCalled();
  });

  it('does not call argv[2].replace("--query=", "") when argv length <= 2', () => {
    parseCommandLineArgs(['node', '/some/random/path']);
  });
});
