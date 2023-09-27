import pkg from '@apollo/client';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

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

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  auth: {
    user: 'info@detable.co',
    pass: process.env.PASSWORD
  },
  debug: true
});

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const checkAndSendEmail = async () => {
  try {
    const { data } = await client.query({
      query: gql(evilEventsQuery)
    });

    const mints = data.issues || [];

    for (const mint of mints) {
      if (mint.amount > constantThreshold) {
        const truncatedAmount = (parseFloat(mint.amount) / 1000000).toString();
        const emailContent = `
          New Mint Event:
          Amount: ${truncatedAmount} USDT
          Block Number: ${mint.blockNumber}
          Transaction Hash: ${mint.transactionHash}
        `;

        const mailOptionsFurkan = {
          from: 'info@detable.co',
          to: 'furkan@detable.co',
          subject: 'New Mint Event',
          text: emailContent
        };

        await transporter.sendMail(mailOptionsFurkan);

        console.log('Email sent for a new mint event.');
      }
    }
  } catch (err) {
    console.error('Error checking for new mint events:', err);
  }
};

setInterval(checkAndSendEmail, 60000);