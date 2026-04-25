const { JustWatch } = require('justwatch-api-client');

async function test() {
  const jw = new JustWatch();
  try {
    const results = await jw.search('The Matrix');
    console.log(JSON.stringify(results.slice(0,1), null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();