// Replicated connectToWallet implementation
// Licensed under the same terms as the original source where applicable.

import {
  firstValueFrom,
  interval,
  map,
  tap,
  filter,
  concatMap,
  of,
  throwError,
  take,
  timeout,
  catchError,
  type Observable
} from 'rxjs';
import semver from 'semver';
import { type Logger } from 'pino';
import type {
  DAppConnectorAPI,
  DAppConnectorWalletAPI,
  ServiceUriConfig
} from '@midnight-ntwrk/dapp-connector-api';

/**
 * Attempts to discover and enable a Midnight Lace wallet connector exposed on `window.midnight?.mnLace`.
 *
 * Returns the enabled wallet API and the service URI configuration.
 */
export const connectToWallet = (
  logger: Logger
): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> => {
  const COMPATIBLE_CONNECTOR_API_VERSION = '1.x';

  const observable = interval(100).pipe(
    map(() => (globalThis as any).midnight?.mnLace),
    tap((connectorAPI: DAppConnectorAPI | undefined) => {
      logger.info(connectorAPI, 'Check for wallet connector API');
    }),
    filter((connectorAPI: any): connectorAPI is DAppConnectorAPI => !!connectorAPI),
    concatMap((connectorAPI: DAppConnectorAPI) =>
      semver.satisfies(connectorAPI.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION)
        ? of(connectorAPI)
        : throwError(() => {
            logger.error(
              {
                expected: COMPATIBLE_CONNECTOR_API_VERSION,
                actual: connectorAPI.apiVersion
              },
              'Incompatible version of wallet connector API'
            );

            return new Error(
              `Incompatible version of Midnight Lace wallet found. Require '${COMPATIBLE_CONNECTOR_API_VERSION}', got '${connectorAPI.apiVersion}'.`
            );
          })
    ),
    tap((connectorAPI: DAppConnectorAPI) => {
      logger.info(connectorAPI, 'Compatible wallet connector API found. Connecting.');
    }),
    take(1),
    timeout({
      first: 1_000,
      with: () =>
        throwError(() => {
          logger.error('Could not find wallet connector API');

          return new Error('Could not find Midnight Lace wallet. Extension installed?');
        })
    }),
    concatMap(async (connectorAPI: DAppConnectorAPI) => {
      const isEnabled = await connectorAPI.isEnabled();

      logger.info(isEnabled, 'Wallet connector API enabled status');

      return connectorAPI;
    }),
    timeout({
      first: 5_000,
      with: () =>
        throwError(() => {
          logger.error('Wallet connector API has failed to respond');

          return new Error('Midnight Lace wallet has failed to respond. Extension enabled?');
        })
    }),
    concatMap(async (connectorAPI: DAppConnectorAPI) => ({
      walletConnectorAPI: await connectorAPI.enable(),
      connectorAPI
    })),
    catchError(() =>
      throwError(() => {
        logger.error('Unable to enable connector API. Error: ');
        return new Error('Application is not authorized');
      })
    ),
    concatMap(
      async ({
        walletConnectorAPI,
        connectorAPI
      }: {
        walletConnectorAPI: DAppConnectorWalletAPI;
        connectorAPI: DAppConnectorAPI;
      }) => {
        const uris = await connectorAPI.serviceUriConfig();

        logger.info('Connected to wallet connector API and retrieved service configuration');

        return { wallet: walletConnectorAPI, uris };
      }
    )
  ) as Observable<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }>;

  return firstValueFrom(observable);
};
