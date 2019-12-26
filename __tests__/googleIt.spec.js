/* eslint-disable no-console */
import { exec } from 'child_process';
import {
  errorTryingToOpen,
  openInBrowser,
  getSnippet,
  display,
  // getResults,
  // getResponseBody,
} from '../src/googleIt';
import { logIt } from '../src/utils';

global.console = {
  log: jest.fn(),
};

jest.mock('child_process', () => ({
  exec: jest.fn(() => {}),
}));

jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  logIt: jest.fn(() => {}),
}));

describe('errorTryingToOpen', () => {
  it('does not call console.log when error is falsy', () => {
    console.log.mockClear();
    errorTryingToOpen(false);
    expect(console.log).not.toHaveBeenCalled();
  });

  it('calls console.log 3 times when error is true', () => {
    console.log.mockClear();
    errorTryingToOpen('something really bad', 'stdout', 'stderr');
    expect(console.log).toHaveBeenCalledTimes(3);
  });
});

describe('openInBrowser', () => {
  it('does not call exec when "open" is undefined', () => {
    exec.mockClear();
    openInBrowser(undefined);
    expect(exec).not.toHaveBeenCalled();
  });

  it('calls exec results.slice(0, open).length times when "open" is > 0', () => {
    exec.mockClear();
    openInBrowser(3, [{ link: '' }, { link: '' }, { link: '' }]);
    expect(exec).toHaveBeenCalledTimes(3);
  });
});

describe('getSnippet', () => {
  it('maps over elem.children and data field, joined by empty string', () => {
    const result = getSnippet({
      children: [{ data: '1' }, { data: '2' }, { data: '3' }],
    });
    expect(result).toBe('123');
  });

  it('returns child.children.map(c => c.data) when child.data does not exist', () => {
    const result = getSnippet({
      children: [
        { children: [{ data: '1' }] },
        { children: [{ data: '2' }] },
        { children: [{ data: '3' }] },
      ],
    });
    expect(result).toBe('123');
  });
});

describe('display', () => {
  it('calls logIt once for each result (+ once for newline) when 3rd arg (onlyUrls) is true', () => {
    logIt.mockClear();
    display([{ link: 'a' }, { link: 'b' }], false, true);
    expect(logIt).toHaveBeenCalledTimes(3);
  });

  it('calls logIt 4 times for each result (+ once for newline) when 3rd arg is false', () => {
    logIt.mockClear();
    display([
      { title: 'a', link: 'a', snippet: 'a' },
      { title: 'b', link: 'b', snippet: 'b' },
    ], false, false);
    expect(logIt).toHaveBeenCalledTimes(9);
  });

  it('calls logIt once for each result (+ once for newline) when 3rd arg (onlyUrls) is false but title is missing', () => {
    logIt.mockClear();
    display([
      { link: 'a', snippet: 'a' },
      { link: 'b', snippet: 'b' },
    ], false, false);
    expect(logIt).toHaveBeenCalledTimes(3);
  });
});
