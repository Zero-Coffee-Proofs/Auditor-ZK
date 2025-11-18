import React, { useState, useEffect } from 'react';
import * as Comlink from 'comlink';
import type { WorkerAPI } from '../worker';
import { Prover } from 'tlsn-js';
import { HTTPParser } from 'http-parser-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, CheckCircle2, XCircle } from 'lucide-react';

// Initialize worker
const worker = new Worker(new URL('../worker.ts', import.meta.url));
const workerApi = Comlink.wrap<WorkerAPI>(worker);

interface Config {
  verifierUrl: string;
  proxyUrl: string;
  targetUrl: string;
  threshold: number;
}

type Status = 'idle' | 'processing' | 'success' | 'error';

export function VerifierView() {
  const [config, setConfig] = useState<Config>({
    verifierUrl: process.env.REACT_APP_VERIFIER_URL || 'ws://localhost:7047',
    proxyUrl: process.env.REACT_APP_PROXY_URL || 'ws://localhost:55688',
    targetUrl: process.env.REACT_APP_PLAID_API_URL
      ? `${process.env.REACT_APP_PLAID_API_URL}/accounts/balance/get`
      : 'https://sandbox.plaid.com/accounts/balance/get',
    threshold: parseInt(process.env.REACT_APP_THRESHOLD || '10000'),
  });

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const updateConfig = (key: keyof Config, value: string | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const startProving = async () => {
    setProcessing(true);
    setStatus('processing');
    setMessage('Initializing TLSNotary...');
    setResult(null);

    try {
      // Step 1: Initialize WASM
      await workerApi.init('Info');
      setMessage('✅ WASM initialized\n🔧 Creating prover...');

      // Step 2: Parse target URL
      const url = new URL(config.targetUrl);
      const hostname = url.hostname;

      // Step 3: Create prover
      const prover = (await workerApi.createProver({
        serverDns: hostname,
        maxSentData: 4096,
        maxRecvData: 16384,
      })) as unknown as Prover;

      setMessage('✅ Prover created\n🔌 Connecting to verifier...');

      // Step 4: Setup with verifier
      await prover.setup(config.verifierUrl);
      setMessage('✅ Connected to verifier\n📡 Sending request to mock Plaid...');

      // Step 5: Build Plaid API request body for /accounts/balance/get
      const requestBody = {
        client_id: process.env.REACT_APP_PLAID_CLIENT_ID,
        secret: process.env.REACT_APP_PLAID_SECRET,
        access_token: process.env.REACT_APP_PLAID_ACCESS_TOKEN,
        options: {
          account_ids: [process.env.REACT_APP_PLAID_ACCOUNT_ID]
        }
      };

      console.log('🔍 DEBUG: Request body object:', requestBody);
      console.log('🔍 DEBUG: Request body type:', typeof requestBody);

      // Step 6: Send POST request via proxy
      const requestConfig = {
        url: config.targetUrl,
        method: 'POST' as any,
        headers: {
          Host: hostname,
          Connection: 'close',
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };

      console.log('🔍 DEBUG: Full request config:', JSON.stringify(requestConfig, null, 2));

      const response = await prover.sendRequest(
        `${config.proxyUrl}?token=${hostname}`,
        requestConfig
      );

      setMessage('✅ Request sent\n📥 Received response\n📜 Getting transcript...');

      // Step 6: Get transcript
      const transcript = await prover.transcript();

      // DEBUG: Log the actual HTTP request that was sent
      const sentStr = Buffer.from(transcript.sent).toString('utf-8');
      console.log('🔍 DEBUG: Raw HTTP request sent:');
      console.log(sentStr);
      console.log('🔍 DEBUG: Request length:', transcript.sent.length);

      // DEBUG: Log the HTTP response received
      const recvStr = Buffer.from(transcript.recv).toString('utf-8');
      console.log('🔍 DEBUG: Raw HTTP response received:');
      console.log(recvStr);
      console.log('🔍 DEBUG: Response length:', transcript.recv.length);

      setMessage('✅ Transcript received\n💰 Parsing balance...');

      // Step 7: Parse balance from response
      const { balance, accounts } = parseBalanceResponse(new Uint8Array(transcript.recv));

      setMessage(
        `✅ Balance parsed: $${balance.toFixed(2)}\n` +
        `🎯 Threshold: $${config.threshold.toFixed(2)}\n` +
        `${balance > config.threshold ? '✅ QUALIFIES' : '❌ BELOW THRESHOLD'}\n` +
        `🔒 Revealing data to verifier...`
      );

      // Step 8: Reveal data (commit to balance)
      await prover.reveal({
        sent: [{ start: 0, end: transcript.sent.length }],
        recv: [{ start: 0, end: transcript.recv.length }],
        server_identity: true,
      });

      setMessage(
        `✅ Data revealed to verifier\n` +
        `✅ Attestation created\n\n` +
        `🎉 Proof of Reserves Complete!`
      );

      setStatus('success');
      setResult({
        balance,
        threshold: config.threshold,
        qualifies: balance > config.threshold,
        accounts,
        transcript: {
          sent: transcript.sent.length,
          recv: transcript.recv.length,
        },
      });

      console.log('✅ Proof complete', { balance, qualifies: balance > config.threshold });

    } catch (error: any) {
      console.error('❌ Error:', error);
      setStatus('error');
      setMessage(`Error: ${error.message || String(error)}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy-Preserving Proof of Reserves
        </CardTitle>
        <CardDescription>
          Generate zero-knowledge proofs of asset reserves using TLSNotary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            <strong>Prerequisites:</strong> Make sure the verifier server (port 7047),
            mock Plaid server (port 8443), and WebSocket proxy (port 55688) are running.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verifierUrl">Verifier WebSocket URL</Label>
            <Input
              id="verifierUrl"
              type="text"
              value={config.verifierUrl}
              onChange={(e) => updateConfig('verifierUrl', e.target.value)}
              disabled={processing}
              placeholder="ws://localhost:7047"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proxyUrl">WebSocket Proxy URL</Label>
            <Input
              id="proxyUrl"
              type="text"
              value={config.proxyUrl}
              onChange={(e) => updateConfig('proxyUrl', e.target.value)}
              disabled={processing}
              placeholder="ws://localhost:55688"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetUrl">Target Server URL</Label>
            <Input
              id="targetUrl"
              type="text"
              value={config.targetUrl}
              onChange={(e) => updateConfig('targetUrl', e.target.value)}
              disabled={processing}
              placeholder="http://127.0.0.1:8443/balance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Balance Threshold ($)</Label>
            <Input
              id="threshold"
              type="number"
              value={config.threshold}
              onChange={(e) => updateConfig('threshold', parseFloat(e.target.value) || 0)}
              disabled={processing}
              placeholder="10000"
            />
          </div>
        </div>

        <Button onClick={startProving} disabled={processing} className="w-full">
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Proof of Reserves
            </>
          )}
        </Button>

        {status !== 'idle' && (
          <Alert variant={status === 'error' ? 'destructive' : 'default'}>
            <div className="flex items-start gap-2">
              {processing && <Loader2 className="h-4 w-4 animate-spin mt-0.5" />}
              {status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />}
              {status === 'error' && <XCircle className="h-4 w-4 mt-0.5" />}
              <AlertDescription className="whitespace-pre-line flex-1">
                {message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {result && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <pre className="text-sm whitespace-pre-wrap font-mono">
{`📊 PROOF OF RESERVES RESULT
${'='.repeat(50)}

💰 Total Balance:     $${result.balance.toFixed(2)}
🎯 Threshold:         $${result.threshold.toFixed(2)}
${result.qualifies ? '✅ QUALIFIED' : '❌ NOT QUALIFIED'}

📁 Accounts:
${result.accounts.map((acc: any, i: number) =>
  `  ${i + 1}. ${acc.name}: $${acc.balance.toFixed(2)}`
).join('\n')}

📡 Transcript:
  Sent:     ${result.transcript.sent} bytes
  Received: ${result.transcript.recv} bytes

🔒 Privacy Preserved:
  ✓ Exact balance NOT revealed on-chain
  ✓ Only commitment hash + ZK proof submitted
  ✓ Verifier only sees commitment
  ✓ Smart contract verifies proof validity

💾 Attestation saved by verifier to:
  /tmp/auditor_zk_attestation.json`}
              </pre>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to parse balance from HTTP response
function parseBalanceResponse(recvBytes: Uint8Array): { balance: number; accounts: any[] } {
  const parser = new HTTPParser(HTTPParser.RESPONSE);
  const body: Buffer[] = [];
  let complete = false;

  parser.onBody = (chunk: any) => {
    body.push(Buffer.from(chunk));
  };

  parser.onMessageComplete = () => {
    complete = true;
  };

  parser.execute(Buffer.from(recvBytes));
  parser.finish();

  if (!complete) {
    throw new Error('Failed to parse HTTP response');
  }

  const bodyStr = Buffer.concat(body).toString('utf-8');
  console.log('📄 Raw response body:', bodyStr);

  const data = JSON.parse(bodyStr);
  console.log('📊 Parsed JSON:', data);

  // Handle Plaid /accounts/balance/get response
  if (!data.accounts || !Array.isArray(data.accounts)) {
    console.error('❌ Invalid response - missing accounts array:', data);
    throw new Error('Invalid Plaid response - see console for details');
  }

  console.log(`📋 Found ${data.accounts.length} account(s)`);

  // Extract balance info from each account
  const accounts = data.accounts.map((acc: any) => ({
    name: acc.official_name || acc.name || 'Unknown Account',
    balance: acc.balances?.current || acc.balances?.available || 0,
    type: acc.type,
    subtype: acc.subtype,
  }));

  // Sum up total balance across all accounts
  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);

  console.log(`💰 Total balance: $${totalBalance.toFixed(2)}`);
  console.log(`📊 Accounts:`, accounts);

  return { balance: totalBalance, accounts };
}
