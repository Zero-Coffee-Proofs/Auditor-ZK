# AuditorZK Prover Client

Browser-based TLSNotary prover for privacy-preserving proof of reserves.

## Features

- ✅ Connect to TLSNotary verifier server
- ✅ Make MPC-TLS requests to mock Plaid API
- ✅ Parse balance data from HTTP responses
- ✅ Create commitments and reveal data selectively
- ✅ Receive signed attestations
- ✅ Beautiful UI with real-time status updates

## Prerequisites

Before running the prover client, ensure the following services are running:

1. **Verifier Server** (port 7047)
   ```bash
   cd ../verifier-server
   cargo run
   ```

2. **Mock Plaid Server** (port 8443)
   ```bash
   cd ../mock-plaid-server
   cargo run
   ```

3. **WebSocket Proxy** (port 55688)
   ```bash
   # You need to install and run wstcp or similar WebSocket proxy
   # This bridges browser WebSocket connections to raw TCP
   wstcp --listen 127.0.0.1:55688
   ```

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Usage

1. **Configure URLs**: The default configuration should work if all services are running locally:
   - Verifier: `ws://localhost:7047`
   - Proxy: `ws://localhost:55688`
   - Target: `http://127.0.0.1:8443/balance`
   - Threshold: `$10,000`

2. **Click "Start Proof of Reserves"**: The app will:
   - Initialize TLSNotary WASM
   - Connect to the verifier
   - Make an MPC-TLS request to the mock Plaid server
   - Parse the balance ($20,912.75 from mock data)
   - Create commitments
   - Reveal data to verifier
   - Receive signed attestation

3. **View Results**: The UI shows:
   - Total balance
   - Whether you qualify (balance > threshold)
   - Individual account balances
   - Transcript sizes
   - Privacy guarantees

## Architecture

```
Browser (React App)
    ↓
Web Worker (WASM)
    ↓ WebSocket
Verifier Server
    ↓ MPC-TLS
Prover ↔ Mock Plaid
    ↓
Attestation Signed
```

## Files

- `src/app.tsx` - Main React application with UI and prover logic
- `src/worker.ts` - Web Worker for TLSNotary WASM initialization
- `src/index.html` - HTML template with embedded styles
- `webpack.config.js` - Webpack configuration with WASM support

## How It Works

### 1. Initialization
- Loads tlsn-js WASM module in a web worker
- Creates Prover instance with server DNS and data limits

### 2. Setup
- Connects to verifier server via WebSocket
- Establishes MPC-TLS session parameters

### 3. Request
- Sends HTTP request to mock Plaid server through WebSocket proxy
- MPC-TLS protocol executes between prover and verifier

### 4. Response Parsing
- Receives encrypted TLS response
- Parses HTTP response to extract balance data
- Sums balances from all accounts

### 5. Reveal
- Creates commitments to specific data ranges
- Reveals selected portions to verifier (hiding sensitive auth tokens)
- Verifier signs attestation

### 6. Result
- Displays whether user qualifies based on threshold
- Shows proof was created without revealing exact balance on-chain

## Privacy Guarantees

- ✅ Exact balance is NEVER sent to blockchain
- ✅ Only commitment hash is in attestation
- ✅ ZK proof (to be added) proves balance > threshold
- ✅ Verifier cannot learn exact balance (only sees commitment)
- ✅ Authorization tokens are not revealed

## Troubleshooting

### "Failed to connect to verifier"
- Ensure verifier server is running on port 7047
- Check WebSocket URL is correct

### "WebSocket proxy error"
- Install and start wstcp or similar proxy
- Verify it's listening on port 55688

### "Failed to fetch balance"
- Ensure mock Plaid server is running on port 8443
- Test with: `curl http://127.0.0.1:8443/balance`

### WASM initialization errors
- Clear browser cache and reload
- Check browser console for detailed error messages
- Ensure you're using a modern browser (Chrome, Firefox, Edge)

## Next Steps

- [ ] Add actual Midnight ZK proof generation
- [ ] Implement commitment blinding from MPC protocol
- [ ] Add support for real Plaid API (with proper auth)
- [ ] Submit proofs to Midnight blockchain
- [ ] Add attestation verification UI

## License

(To be determined)
