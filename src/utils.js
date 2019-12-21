
// NOTE:
// I chose the User-Agent value from http://www.browser-info.net/useragents
// Not setting one causes Google search to not display results
const defaultUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0';

const defaultLimit = 10;

const getDefaultRequestOptions = (limit, query, userAgent) => ({
  url: 'https://www.google.com/search',
  qs: {
    q: query,
    num: limit || defaultLimit,
  },
  headers: {
    'User-Agent': userAgent || defaultUserAgent,
  },
});

const titleSelector = 'div > div > div > div.r > a > h3 > div';
const linkSelector = 'div.rc > div.r > a';
const snippetSelector = 'div > div > div > div.s > div > a > span';

module.exports = {
  defaultUserAgent,
  defaultLimit,
  getDefaultRequestOptions,
  titleSelector,
  linkSelector,
  snippetSelector,
};
