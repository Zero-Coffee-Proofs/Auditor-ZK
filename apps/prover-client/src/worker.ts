import * as Comlink from 'comlink';
import init, { Prover } from 'tlsn-js';
import type { LoggingLevel } from 'tlsn-wasm';

let isInitialized = false;

const api = {
  async init(loggingLevel: LoggingLevel = 'Info') {
    if (!isInitialized) {
      await init({ loggingLevel });
      isInitialized = true;
      console.log('✅ TLSNotary WASM initialized');
    }
    return true;
  },

  async createProver(config: { serverDns: string; maxSentData?: number; maxRecvData?: number }) {
    if (!isInitialized) {
      throw new Error('Worker not initialized. Call init() first.');
    }

    const { serverDns, maxSentData = 4096, maxRecvData = 16384 } = config;

    console.log(`📝 Creating prover for ${serverDns}`);
    const prover = await new Prover({
      serverDns,
      maxSentData,
      maxRecvData,
    });

    return Comlink.proxy(prover);
  },
};

Comlink.expose(api);

export type WorkerAPI = typeof api;
