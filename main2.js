import fetch from 'node-fetch';

// const args = process.argv.slice(2);
// const subgraph = args[0];
// const protocol = args[1];

const theGraphUrl = 'https://api.thegraph.com/subgraphs/name/furkanakal/evilusdt/';

const evilEventsQuery = e => {
  return `
    {
      issues(first: 5, orderBy: blockNumber, orderDirection: desc) {
        amount
        blockNumber
        transactionHash
      }
      redeems(first: 5, orderBy: blockNumber, orderDirection: desc) {
        amount
        blockNumber
        transactionHash
      }
      addedBlackLists(first: 5, orderBy: blockNumber, orderDirection: desc) {
        _user
        blockNumber
        transactionHash
      }
      removedBlackLists(first: 5, orderBy: blockNumber, orderDirection: desc) {
        _user
        blockNumber
        transactionHash
      }
      destroyedBlackFunds(first: 5, orderBy: blockNumber, orderDirection: desc) {
        _balance
        _blackListedUser
        blockNumber
        transactionHash
      }
    }
  `
};

(async () => {
  // Fetch from TheGraph
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

  const evilEventsData = await queryResponse.json();

  const evilEvents = evilEventsData.data.redeems.map(redeem => {
    return redeem.amount
  });

  let queryValues = '';

  for (let amount of evilEvents) {
    queryValues = amount;
  }

  await console.log(JSON.stringify(queryResponse));
})();

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
