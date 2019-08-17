/* eslint-disable no-console */
/* eslint-disable array-callback-return */
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const { exec } = require('child_process');

// NOTE:
// I chose the User-Agent value from http://www.browser-info.net/useragents
// Not setting one causes Google search to not display results

function logIt(message, disableConsole) {
  if (!disableConsole) {
    console.log(message);
  }
}

function saveToFile(output, results) {
  if (output !== undefined) {
    fs.writeFile(output, JSON.stringify(results, null, 2), 'utf8', err => {
      if (err) {
        console.err(`Error writing to file ${output}: ${err}`);
      }
    });
  }
}

function errorTryingToOpen(error, stdout, stderr) {
  if (error) {
    console.log(`Error trying to open link in browser: ${error}`);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }
}

function openInBrowser(open, results) {
  if (open !== undefined) {
    // open is the first X number of links to open
    results.slice(0, open).forEach(result => {
      exec(`open ${result.link}`, errorTryingToOpen);
    });
  }
}

function getSnippet(elem) {
  return elem.children
    .map(child => {
      if (child.data === null) {
        return child.children.map(c => c.data);
      }
      return child.data;
    })
    .join('');
}

function display(results, disableConsole, onlyUrls) {
  logIt('\n', disableConsole);
  results.forEach(result => {
    if (onlyUrls) {
      logIt(result.link.green, disableConsole);
    } else {
      if (result.title) {
        logIt(result.title.blue, disableConsole);
        logIt(result.link.green, disableConsole);
        logIt(result.snippet, disableConsole);
        logIt('\n', disableConsole);
      } else {
        logIt('Result title is undefined.');
      }
    }
  });
}

function getResults({ data, noDisplay, disableConsole, onlyUrls }) {
  const $ = cheerio.load(data);
  let results = [];

  // result titles
  const titles = $('div.rc > div.r > a > h3').contents();
  titles.each((index, elem) => {
    if (elem.data) {
      results.push({ title: elem.data });
    } else {
      results.push({ title: elem.children[0].data });
    }
  });

  // result links
  $('div.rc > div.r > a').map((index, elem) => {
    if (index < results.length) {
      results[index] = Object.assign(results[index], {
        link: elem.attribs.href
      });
    }
  });

  // result snippets
  $('div.rc > div.s > span.st').map((index, elem) => {
    if (index < results.length) {
      results[index] = Object.assign(results[index], {
        snippet: getSnippet(elem)
      });
    }
  });

  if (onlyUrls) {
    results = results.map(r => ({ link: r.link }));
  }
  if (!noDisplay) {
    display(results, disableConsole, onlyUrls);
  }
  return results;
}

function googleIt(config) {
  const { query, limit, userAgent, output, open, options = {} } = config;
  const defaultOptions = {
    url: 'https://www.google.com/search',
    qs: {
      q: query,
      num: limit || 10
    },
    headers: {
      'User-Agent':
        userAgent ||
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0'
    }
  };

  return new Promise((resolve, reject) => {
    request(
      Object.assign({}, defaultOptions, options),
      (error, response, body) => {
        if (error) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject(`Error making web request: ${error}`, null);
        }

        if (response.statusCode !== 200) {
          return reject(cheerio.load(response.body).text());
        }

        const results = getResults({
          data: body,
          noDisplay: config['no-display'],
          disableConsole: config.disableConsole,
          onlyUrls: config['only-urls']
        });
        saveToFile(output, results);
        openInBrowser(open, results);
        return resolve(results);
      }
    );
  });
}

module.exports = googleIt;
