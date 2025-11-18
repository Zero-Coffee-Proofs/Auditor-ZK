import 'dotenv/config';
import express from 'express';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || ''
    }
  }
});

const plaidClient = new PlaidApi(plaidConfig);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create link token
app.post('/api/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-' + Date.now() },
      client_name: 'London Hackathon App',
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en'
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// Exchange public token for access token
app.post('/api/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    const response = await plaidClient.itemPublicTokenExchange({
      public_token
    });
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

// Get account balance
app.post('/api/balance', async (req, res) => {
  try {
    const { access_token } = req.body;
    const response = await plaidClient.accountsBalanceGet({
      access_token
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

app.listen(8080, () => {
  console.log('Backend listening on http://localhost:8080');
});
