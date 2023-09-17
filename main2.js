import fetch from 'node-fetch';

// const args = process.argv.slice(2);
// const subgraph = args[0];
// const protocol = args[1];

const theGraphUrl = 'https://api.thegraph.com/subgraphs/name/furkanakal/evilusdt';

const evilEventsQuery = e => {
  return `
    {
      issues(first: 50, orderBy: amount, orderDirection: desc) {
        amount
        blockNumber
        transactionHash
      }
      redeems(first: 50, orderBy: amount, orderDirection: desc) {
        amount
        blockNumber
        transactionHash
      }
    }
  `
};

(async () => {
  try {
    console.log('Start processing...');
    const queryResponse = await fetch(theGraphUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: evilEventsQuery(5),
      }),
    });

    if (!queryResponse.ok) {
      throw new Error(`HTTP error! Status: ${queryResponse.status}`);
    }

    const evilEventsData = await queryResponse.json();

    const issuesAmounts = evilEventsData.data.issues.map(issue => issue.amount);
    const redeemsAmounts = evilEventsData.data.redeems.map(redeem => redeem.amount);

    console.log(JSON.stringify(issuesAmounts));
  } catch (error) {
    console.error('Error:', error.message);
  }
})();


// (async () => {
//   // Fetch from TheGraph
//   console.log('Start processing...');
//   const queryResponse = await fetch(theGraphUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       query: evilEventsQuery(5),
//     }),
//   });

//   const evilEventsData = await queryResponse.json();

//   const evilEvents = evilEventsData.redeems.map(redeem => {
//     return redeem.amount
//   });

//   let queryValues = '';

//   for (let amount of evilEvents) {
//     queryValues = amount;
//   }

//   await console.log(JSON.stringify(queryResponse));
// })();

// async function pushEvents(queryValues) {
//   const client = new Client();
//   await client.connect();
//   try {
//     const result = await client.query(
//       `
//       INSERT INTO ${subgraph}.whitelisted_pools
//       (id, block_range)
//       values
//       ${queryValues};
//       `,
//       [],
//     );
//     return result;
//   } catch (err) {
//     console.log(err);
//   } finally {
//     console.log('done successfully');
//     await client.end();
//   }
// };
