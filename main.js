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

const transporter = nodemailer.createTransport({
  service: '',
  auth: {
    user: '',
    pass: ''
  }
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
        const emailContent = `
          New Mint Event:
          Amount: ${mint.amout}
          Block Number: ${mint.blockNumber}
          Transaction Hash: ${mint.transactionHash}
        `;

        const mailOptions = {
          from: '',
          to: '',
          subject: 'New Mint Event',
          text: emailContent
        };

        await transporter.sendMail(mailOptions);

        console.log('Email sent for a new mint event.');
      }
    }
  } catch (err) {
    console.error('Error checking for new mint events:', err);
  }
};

setInterval(checkAndSendEmail, 6000);