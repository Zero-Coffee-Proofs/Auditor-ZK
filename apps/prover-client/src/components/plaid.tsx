import { usePlaidLink } from 'react-plaid-link';
import { useState } from 'react';
import { Button } from './ui/button';

const BACKEND_URL = 'http://localhost:8080';

export const Plaid = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // get link token from backend
  const createLinkToken = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/create_link_token`, {
        method: 'POST'
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error('Error creating link token:', error);
    }
  };

  // exchange public token for access token
  const onSuccess = async (public_token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/exchange_public_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token })
      });
      const data = await response.json();
      setAccessToken(data.access_token);
      console.log('Access token received:', data.access_token);
    } catch (error) {
      console.error('Error exchanging token:', error);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Plaid Link Integration</h1>

      {!linkToken && <Button onClick={createLinkToken}>Get Link Token</Button>}

      {linkToken && !accessToken && (
        <Button onClick={() => open()} disabled={!ready}>
          Connect Bank Account
        </Button>
      )}

    </div>
  );
};
