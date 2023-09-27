import pkg from '@apollo/client';
import nodemailer from 'nodemailer';
const { ApolloClient, InMemoryCache, gql } = pkg;

const APIURL = 'https://api.thegraph.com/subgraphs/name/furkanakal/evilusdt';
const constantThreshold = 1000;

const evilEventsQuery = `
  query {
    issues(first: 5, orderBy: blockNumber, orderDirection: desc) {
      amount
      blockNumber
      transactionHash
    }
  }
`;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql(evilEventsQuery),
  })
  .then((data) => console.log('Subgraph data: ', data))
  .catch((err) => {
    console.log('Error fetching data: ', err)
  });