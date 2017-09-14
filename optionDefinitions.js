const optionDefinitions = [
  { name: 'query', alias: 'q', type: String }, // the query that should be sent to the Google search
  { name: 'output', alias: 'o', type: String }, // name of the JSON file to save results to
  { name: 'save', alias: 's', type: String }, // name of the html file if you want to save the actual response from the html request
  { name: 'limit', alias: 'l', type: Number }, // number of search results to be returned
  { name: 'verbose', alias: 'v', type: Boolean }, // console.log useful statements to show what's currently taking place
  { name: 'interactive', alias: 'i', type: Boolean }, // once results are returned, show them in an interactive prompt where user can scroll through them
  { name: 'bold-matching-text', alias: 'b', type: Boolean}, // only takes effect when interactive (-i) flag is set as well, will bold test in results that matched the query
  { name: 'stackoverflow-github-only', alias: 'X', type: Boolean } // option to limit results to only these two sites
]

module.exports = optionDefinitions
