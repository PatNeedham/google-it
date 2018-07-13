const optionDefinitions = [
  // the query that should be sent to the Google search
  { name: 'query', alias: 'q', type: String },

  // name of the JSON file to save results to
  { name: 'output', alias: 'o', type: String },

  // prevent results from appearing in the terminal output. Should only be used
  // with --output (-o) command when saving results to a file
  { name: 'no-display', alias: 'n', type: Boolean},

  // name of the html file if you want to save the actual response from the
  // html request
  { name: 'save', alias: 's', type: String },

  // number of search results to be returned
  { name: 'limit', alias: 'l', type: Number },

  // console.log useful statements to show what's currently taking place
  { name: 'verbose', alias: 'v', type: Boolean },

  // once results are returned, show them in an interactive prompt where user
  // can scroll through them
  { name: 'interactive', alias: 'i', type: Boolean },

  // only display the URLs, instead of the titles and snippets
  { name: 'only-urls', alias: 'u', type: Boolean },

  // only takes effect when interactive (-i) flag is set as well, will bold
  // test in results that matched the query
  { name: 'bold-matching-text', alias: 'b', type: Boolean},

  // option to limit results to only these two sites
  { name: 'stackoverflow-github-only', alias: 'X', type: Boolean },

  // option to open the first X number of results directly in browser
  // (only tested on Mac!). 
  { name: 'open', alias: 'O', type: Number }
]

module.exports = optionDefinitions
