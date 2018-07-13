var request = require('request')
var fs = require('fs')
var cheerio = require('cheerio')
var colors = require('colors')
const util = require('util')
const exec = require('child_process').exec

// NOTE:
// I chose the User-Agent value from http://www.browser-info.net/useragents
// Not setting one causes Google search to not display results

function logIt(message, disableConsole) {
  if (!disableConsole) {
    console.log(message)
  }
}

function saveToFile(output, results) {
  if (output !== undefined) {
    fs.writeFile(output, JSON.stringify(results, null, 2), 'utf8', (err) => {
      if (err) {
        console.err('Error writing to file ' + output + ': ' + err)
      }
    })
  }
}

function errorTryingToOpen(error, stdout, stderr) {
  if (error) {
    console.log(`Error trying to open link in browser: ${error}`)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  }
}

function openInBrowser(open, results) {
  if (open !== undefined) {
    // open is the first X number of links to open
    results.slice(0, open).forEach((result, i) => {
      exec(`open ${result.link}`, errorTryingToOpen);
    })
  }
}

function googleIt(config) {
  var {query, limit, userAgent, output, open, options = {}} = config
  var defaultOptions = {
    url: `https://www.google.com/search?q=${query}&gws_rd=ssl&num=${limit || 10}`,
    headers: {
      'User-Agent': (userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0')
    }
  };

  return new Promise((resolve, reject) => {
    request(Object.assign({}, defaultOptions, options), (error, response, body) => {
      if (error) {
        return reject("Error making web request: " + error, null)
      } else {
        var results = getResults(body, config['no-display'], config['disableConsole'], config['only-urls'])
        saveToFile(output, results)
        openInBrowser(open, results)
        return resolve(results);
      }
    });
  });
}

function getSnippet(elem) {
  return elem['children'].map(child => {
    if (child.data === null) {
      return child.children.map(c => c.data)
    } else {
      return child.data
    }
  }).join('')
}

function display(results, disableConsole, onlyUrls) {
  logIt("\n", disableConsole)
  results.forEach((result, i) => {
    if (onlyUrls) {
      logIt(result.link.green, disableConsole)
    } else {
      logIt(result.title.blue, disableConsole)
      logIt(result.link.green, disableConsole)
      logIt(result.snippet, disableConsole)
      logIt("\n", disableConsole)
    }
  })
}

function getResults(data, noDisplay, disableConsole, onlyUrls) {
  const $ = cheerio.load(data)
  var results = []

  // result titles
  var titles = $('div.rc > h3.r > a').contents()
  titles.each((index, elem) => {
    results.push({"title": elem.data})
  })

  // result links
  $('div.rc > h3.r > a').map((index, elem) => {
    if (index < results.length) {
      results[index] = Object.assign(results[index], {"link": elem['attribs']['href']})
    }
  })

  // result snippets
  $('div.rc > div.s > div > span.st').map((index, elem) => {
    if (index < results.length) {
      var snippet = getSnippet(elem)
      results[index] = Object.assign(results[index], {snippet: snippet})
    }
  })
  
  if (onlyUrls) {
    results = results.map(r => ({link: r.link}))
  }
  if (!noDisplay) {
    display(results, disableConsole, onlyUrls)
  }
  return results
}

module.exports = googleIt
