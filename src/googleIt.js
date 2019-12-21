/* eslint-disable no-console */
/* eslint-disable array-callback-return */
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
require('colors');
const { exec } = require('child_process');

const {
  getDefaultRequestOptions,
  titleSelector,
  linkSelector,
  snippetSelector,
} = require('./utils');

function logIt(message, disableConsole) {
  if (!disableConsole) {
    console.log(message);
  }
}

function saveToFile(output, results) {
  if (output !== undefined) {
    fs.writeFile(output, JSON.stringify(results, null, 2), 'utf8', (err) => {
      if (err) {
        console.err(`Error writing to file ${output}: ${err}`);
      }
    });
  }
}

function saveResponse(response, htmlFileOutputPath) {
  if (htmlFileOutputPath) {
    fs.writeFile(htmlFileOutputPath, response.body, () => {
      console.log(`Html file saved to ${htmlFileOutputPath}`);
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
    results.slice(0, open).forEach((result) => {
      exec(`open ${result.link}`, errorTryingToOpen);
    });
  }
}

function getSnippet(elem) {
  return elem.children
    .map((child) => {
      if (!child.data) {
        return child.children.map(c => c.data);
      }
      return child.data;
    })
    .join('');
}

function display(results, disableConsole, onlyUrls) {
  logIt('\n', disableConsole);
  results.forEach((result) => {
    if (onlyUrls) {
      logIt(result.link.green, disableConsole);
    } else if (result.title) {
      logIt(result.title.blue, disableConsole);
      logIt(result.link.green, disableConsole);
      logIt(result.snippet, disableConsole);
      logIt('\n', disableConsole);
    } else {
      logIt('Result title is undefined.');
    }
  });
}

function getResults({
  data, noDisplay, disableConsole, onlyUrls,
}) {
  const $ = cheerio.load(data);
  let results = [];

  const titles = $(titleSelector).contents();
  titles.each((index, elem) => {
    if (elem.data) {
      results.push({ title: elem.data });
    } else {
      results.push({ title: elem.children[0].data });
    }
  });

  $(linkSelector).map((index, elem) => {
    if (index < results.length) {
      results[index] = Object.assign(results[index], {
        link: elem.attribs.href,
      });
    }
  });

  $(snippetSelector).map((index, elem) => {
    if (index < results.length) {
      results[index] = Object.assign(results[index], {
        snippet: getSnippet(elem),
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

function getResponseBody({
  fromFile: filePath, options, htmlFileOutputPath, query, limit, userAgent,
}) {
  return new Promise((resolve, reject) => {
    if (filePath) {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return reject(new Error(`Erorr accessing file at ${filePath}: ${err}`));
        }
        return resolve(data);
      });
    } else {
      const defaultOptions = getDefaultRequestOptions(limit, query, userAgent);
      request(Object.assign({}, defaultOptions, options), (error, response, body) => {
        if (error) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject(`Error making web request: ${error}`, null);
        }

        if (response.statusCode !== 200) {
          return reject(cheerio.load(response.body).text());
        }
        saveResponse(response, htmlFileOutputPath);
        return resolve(body);
      });
    }
  });
}

function googleIt(config) {
  const {
    query, limit, userAgent, output, open, options = {}, htmlFileOutputPath, fromFile,
  } = config;
  return new Promise((resolve, reject) => {
    getResponseBody({
      fromFile, options, htmlFileOutputPath, query, limit, userAgent,
    }).then((body) => {
      const results = getResults({
        data: body,
        noDisplay: config['no-display'],
        disableConsole: config.disableConsole,
        onlyUrls: config['only-urls'],
      });
      saveToFile(output, results);
      openInBrowser(open, results);
      return resolve(results);
    }).catch(reject);
  });
}

module.exports = googleIt;
