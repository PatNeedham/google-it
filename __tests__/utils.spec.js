/* eslint-disable max-params */
/* eslint-disable no-console */
import fs from 'fs';

import {
  getDefaultRequestOptions,
  getTitleSelector,
  getLinkSelector,
  getSnippetSelector,
  defaultLimit,
  defaultStart,
  defaultUserAgent,
  titleSelector,
  linkSelector,
  snippetSelector,
  logIt,
  saveToFile,
  saveResponse,
  getFullQuery,
} from '../src/utils';

global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

jest.mock('fs', () => ({
  writeFile: jest.fn((path, data, options, cb) => {
    // 1st arg passed to callback is the error
    cb(true);
  }),
}));

describe('getDefaultRequestOptions', () => {
  it('uses default limit, start, and userAgent when none of those are passed', () => {
    const requestOptions = getDefaultRequestOptions({ query: 'foo' });
    expect(requestOptions).toEqual({
      url: 'https://www.google.com/search',
      qs: {
        q: 'foo',
        num: defaultLimit,
        start: defaultStart,
      },
      headers: {
        'User-Agent': defaultUserAgent,
      },
    });
  });
});

describe('getTitleSelector', () => {
  it('uses the default value when passedValue is null/undefined and the env var does not exist', () => {
    expect(getTitleSelector()).toBe(titleSelector);
  });
});

describe('getLinkSelector', () => {
  it('uses the default value when passedValue is null/undefined and the env var does not exist', () => {
    expect(getLinkSelector()).toBe(linkSelector);
  });
});

describe('getSnippetSelector', () => {
  it('uses the default value when passedValue is null/undefined and the env var does not exist', () => {
    expect(getSnippetSelector()).toBe(snippetSelector);
  });
});

describe('logIt', () => {
  it('does not call console.log when 2nd arg passed is true', () => {
    logIt('message', true);
    expect(console.log).not.toHaveBeenCalled();
  });

  it('calls console.log when 2nd arg passed is false', () => {
    logIt('message', false);
    expect(console.log).toHaveBeenCalled();
  });
});

describe('saveToFile', () => {
  it('does not call fs.writeFile when output (1st arg) is undefined', () => {
    saveToFile();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('calls fs.writeFile when output exists, and console.error when an error occurs', () => {
    saveToFile('/path/to/output.json', []);
    expect(fs.writeFile).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('does not call console.error when an error does not occur', () => {
    fs.writeFile.mockImplementationOnce((path, data, options, cb) => {
      cb(false);
    });
    console.error.mockClear();
    saveToFile('/path/to/output.json', []);
    expect(console.error).not.toHaveBeenCalled();
  });
});

describe('saveResponse', () => {
  it('does not call fs.writeFile when htmlFileOutputPath (2nd arg) is falsy', () => {
    fs.writeFile.mockClear();
    saveResponse('random response that will not make any difference', false);
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('calls fs.writeFile when htmlFileOutputPath exists', () => {
    fs.writeFile.mockClear();
    fs.writeFile.mockImplementationOnce((path, data, cb) => {
      cb(false);
    });
    saveResponse('foo', '/path/to/my/meaningless/response.xml');
    expect(fs.writeFile).toHaveBeenCalled();
  });
});

describe('getFullQuery', () => {
  it('adds "site:a.com OR site:b.com" when includeSites arg is "a.com,b.com"', () => {
    const result = getFullQuery('something', 'a.com,b.com', '');
    expect(result.includes('site:a.com OR site:b.com')).toBe(true);
  });
  it('adds "-site:a.com AND -site:b.com" when excludeSites arg is "a.com,b.com"', () => {
    const result = getFullQuery('something', '', 'a.com,b.com');
    expect(result.includes('-site:a.com AND -site:b.com')).toBe(true);
  });
});
