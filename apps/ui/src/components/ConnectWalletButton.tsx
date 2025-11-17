import * as React from 'react';
import { Button } from '@/components/ui/button';
import { connectToWallet } from '@/contexts/connectToWallet';
import type { Logger } from 'pino';

export function ConnectWalletButton({ logger: loggerProp }: Readonly<{ logger?: Logger }>) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const [connected, setConnected] = React.useState(false);
  const [walletObj, setWalletObj] = React.useState<unknown>(undefined);

  const logger: Logger =
    loggerProp ??
    ({
      info: console.info.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      debug: console.debug.bind(console)
    } as unknown as Logger);

  const handleToggle = async () => {
    setError(undefined);

    if (connected) {
      await disconnectWallet();
      return;
    }

    setLoading(true);
    try {
      const { wallet, uris } = await connectToWallet(logger);
      logger.info({ wallet, uris }, 'Wallet connected');
      setConnected(true);
      setWalletObj(wallet);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to connect');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setLoading(true);
    try {
      if (walletObj) {
        const w = walletObj as Record<string, unknown>;
        const candidates = ['disconnect', 'disable', 'close', 'logout'];
        for (const name of candidates) {
          const fn = w[name];
          if (typeof fn === 'function') {
            await (fn as (...args: any[]) => Promise<any>)();
            break;
          }
        }
      }
    } catch (e) {
      logger.error?.({ error: String(e) }, 'Error while disconnecting wallet');
    } finally {
      setWalletObj(undefined);
      setConnected(false);
      setLoading(false);
    }
  };

  let label = 'Connect Wallet';
  if (loading) {
    label = 'Connecting…';
  } else if (connected) {
    label = 'Connected';
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleToggle}
          disabled={loading}
          variant={connected ? 'destructive' : 'default'}
        >
          {connected ? 'Disconnect' : label}
        </Button>
      </div>
      {error ? <div className="text-destructive mt-2">{error}</div> : null}
    </div>
  );
}

export default ConnectWalletButton;
