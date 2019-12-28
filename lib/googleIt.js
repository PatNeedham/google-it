"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorTryingToOpen = errorTryingToOpen;
exports.openInBrowser = openInBrowser;
exports.getSnippet = getSnippet;
exports.display = display;
exports.getResults = getResults;
exports.getResponseBody = getResponseBody;
exports.default = void 0;

/* eslint-disable no-console */

/* eslint-disable array-callback-return */
var request = require('request');

var fs = require('fs');

var cheerio = require('cheerio');

require('colors');

var _require = require('child_process'),
    exec = _require.exec;

var _require2 = require('./utils'),
    getDefaultRequestOptions = _require2.getDefaultRequestOptions,
    getTitleSelector = _require2.getTitleSelector,
    getLinkSelector = _require2.getLinkSelector,
    getSnippetSelector = _require2.getSnippetSelector,
    logIt = _require2.logIt,
    saveToFile = _require2.saveToFile,
    saveResponse = _require2.saveResponse;

function errorTryingToOpen(error, stdout, stderr) {
  if (error) {
    console.log("Error trying to open link in browser: ".concat(error));
    console.log("stdout: ".concat(stdout));
    console.log("stderr: ".concat(stderr));
  }
}

function openInBrowser(open, results) {
  if (open !== undefined) {
    // open is the first X number of links to open
    results.slice(0, open).forEach(function (result) {
      exec("open ".concat(result.link), errorTryingToOpen);
    });
  }
}

function getSnippet(elem) {
  return elem.children.map(function (child) {
    if (!child.data) {
      return child.children.map(function (c) {
        return c.data;
      });
    }

    return child.data;
  }).join('');
}

function display(results, disableConsole, onlyUrls) {
  logIt('\n', disableConsole);
  results.forEach(function (result) {
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

function getResults(_ref) {
  var data = _ref.data,
      noDisplay = _ref.noDisplay,
      disableConsole = _ref.disableConsole,
      onlyUrls = _ref.onlyUrls,
      titleSelector = _ref.titleSelector,
      linkSelector = _ref.linkSelector,
      snippetSelector = _ref.snippetSelector;
  var $ = cheerio.load(data);
  var results = [];
  var titles = $(getTitleSelector(titleSelector)).contents();
  titles.each(function (index, elem) {
    if (elem.data) {
      results.push({
        title: elem.data
      });
    } else {
      results.push({
        title: elem.children[0].data
      });
    }
  });
  $(getLinkSelector(linkSelector)).map(function (index, elem) {
    if (index < results.length) {
      results[index] = Object.assign(results[index], {
        link: elem.attribs.href
      });
    }
  });
  $(getSnippetSelector(snippetSelector)).map(function (index, elem) {
    if (index < results.length) {
      results[index] = Object.assign(results[index], {
        snippet: getSnippet(elem)
      });
    }
  });

  if (onlyUrls) {
    results = results.map(function (r) {
      return {
        link: r.link
      };
    });
  }

  if (!noDisplay) {
    display(results, disableConsole, onlyUrls);
  }

  return results;
}

function getResponseBody(_ref2) {
  var filePath = _ref2.fromFile,
      options = _ref2.options,
      htmlFileOutputPath = _ref2.htmlFileOutputPath,
      query = _ref2.query,
      limit = _ref2.limit,
      userAgent = _ref2.userAgent,
      start = _ref2.start;
  return new Promise(function (resolve, reject) {
    if (filePath) {
      fs.readFile(filePath, function (err, data) {
        if (err) {
          return reject(new Error("Erorr accessing file at ".concat(filePath, ": ").concat(err)));
        }

        return resolve(data);
      });
    } else {
      var defaultOptions = getDefaultRequestOptions({
        limit: limit,
        query: query,
        userAgent: userAgent,
        start: start
      });
      request(Object.assign({}, defaultOptions, options), function (error, response, body) {
        if (error) {
          reject(new Error("Error making web request: ".concat(error)));
        }

        saveResponse(response, htmlFileOutputPath);
        resolve(body);
      });
    }
  });
}

function googleIt(config) {
  var output = config.output,
      open = config.open,
      returnHtmlBody = config.returnHtmlBody,
      titleSelector = config.titleSelector,
      linkSelector = config.linkSelector,
      snippetSelector = config.snippetSelector,
      start = config.start;
  return new Promise(function (resolve, reject) {
    getResponseBody(config).then(function (body) {
      var results = getResults({
        data: body,
        noDisplay: config['no-display'],
        disableConsole: config.disableConsole,
        onlyUrls: config['only-urls'],
        titleSelector: titleSelector,
        linkSelector: linkSelector,
        snippetSelector: snippetSelector,
        start: start
      });
      saveToFile(output, results);
      openInBrowser(open, results);

      if (returnHtmlBody) {
        return resolve({
          results: results,
          body: body
        });
      }

      return resolve(results);
    }).catch(reject);
  });
}

var _default = googleIt;
exports.default = _default;