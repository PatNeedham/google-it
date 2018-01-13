const googleIt = require('./googleIt');

async function sandbox () {
  try {
    const options = {
      'proxy': 'http://localhost:8118'
    };
    const results = await googleIt({options, 'query': 'covfefe irony'});

    console.log(results);
  } catch (e) {
    console.error(e);
  }
}

sandbox();
