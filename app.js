#! /usr/bin/env node

var request = require('request')
var fs = require('fs')
var cheerio = require('cheerio')
var colors = require('colors')
const ora = require('ora')

const spinner = ora({text: 'Loading results', color: 'cyan'}).start();
const commandLineArgs = require('command-line-args')

const optionDefinitions = require('./optionDefinitions')
const cli_options = commandLineArgs(optionDefinitions)

var query = ""
// first arg is 'node', second is /path/to/file/app.js, third is whatever follows afterward
if (process.argv.length > 2) {
  query = process.argv[2]
  // console.log("query: " + query)
}

// fs.readFile('output.html', 'utf8', (err, data) => {
//   if (err != null) {
//     console.log("err was not null, it is: " + JSON.stringify(err, null, 4))
//   }
//
//   var results = getResults(data)
// })

function googleIt(query, numResults=10) {
  var options = {
    url: `https://www.google.com/search?q=${query}&gws_rd=ssl&num=${numResults}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0'
    }
  }
  request(options, (error, response, body) => {
    if (error) {
      console.log("error: " + error)
    } else {
      spinner.stop()
      var results = getResults(body)
      if (cli_options.output != null) {
        console.log("writing to output file! :) :) :)")
        fs.writeFile(cli_options.output, JSON.stringify(results, null, 2), 'utf8')
      }
    }
    // fs.writeFile('output.html', body, 'utf8', (err) => {
    //   if (err) {
    //     console.log("there was an error: " + err)
    //   } else {
    //     console.log("writeFile successful")
    //   }
    // });
  });
}


googleIt(query != "" ? query : "new york penn station", cli_options.limit)

function getResults(data) {
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
      var snippet = elem['children'].map((child) => {
        if (child.data == null) {
          return child.children.map((c) => c.data)
        } else {
          return child.data
        }
      }).join('')
      results[index] = Object.assign(results[index], {snippet: snippet})
    }
  })

  results.forEach((result, i) => {
    console.log(result.title.blue)
    console.log(result.link.green)
    console.log(result.snippet)
    console.log("\n")
    // console.log(`#${i}: ${result.title} (${result.link})`)
  })
  return results
}
