import * as clipboard from 'clipboard-polyfill/text';
import {
  Asset,
  Networks,
  Operation,
  Server,
  TransactionBuilder,
} from 'stellar-sdk';

export const NETWORK = Networks['PUBLIC'];
export const HORIZON_URL = 'https://horizon.stellar.org';
export const server = new Server(HORIZON_URL);

const horizonEndpoints = [
  'https://horizon.stellar.org',
  'https://horizon.stellar.lobstr.co',
  'https://horizon.publicnode.org',
];

export function copyText(text: string) {
  clipboard.writeText(text);
}

export const getFee = () => {
  return server
    .feeStats()
    .then((feeStats) => feeStats.fee_charged.max)
    .catch(() => '100000');
};

export async function* generateXdr(
  source: string,
  amount: string,
  accountList: { publicKey: string }[]
) {
  let server = new Server(HORIZON_URL);

  const account = await server.loadAccount(source);

  let transactionBuilder = new TransactionBuilder(account, {
    fee: await getFee(),
    networkPassphrase: NETWORK,
  });

  for (let i = 0; i < accountList.length; i++) {
    server = new Server(horizonEndpoints[i % horizonEndpoints.length]);

    const destination = accountList[i].publicKey;

    await server
      .accounts()
      .accountId(destination)
      .call()
      .then(() => {
        transactionBuilder.addOperation(
          Operation.payment({
            amount,
            destination,
            asset: Asset.native(),
          })
        );
      })
      .catch(() => {
        transactionBuilder.addOperation(
          Operation.createAccount({ destination, startingBalance: amount })
        );
      });

    if ((i + 1) % 100 === 0 || i === accountList.length - 1) {
      const xdr = transactionBuilder.setTimeout(0).build().toXDR();

      account.incrementSequenceNumber();

      transactionBuilder = new TransactionBuilder(account, {
        fee: await getFee(),
        networkPassphrase: NETWORK,
      });

      yield { amountComplete: i + 1, xdr };
    }

    yield { amountComplete: i + 1 };
    await new Promise((resolve) =>
      setTimeout(() => resolve(i), 1000 / horizonEndpoints.length)
    );
  }
}
