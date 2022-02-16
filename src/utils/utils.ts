import * as clipboard from 'clipboard-polyfill/text';
import {
  Account,
  Asset,
  Networks,
  Operation,
  TransactionBuilder,
} from 'stellar-base';

export const NETWORK = Networks['PUBLIC'];
export const HORIZON_URL = 'https://horizon.stellar.org';

const horizonEndpoints = [
  'https://horizon.stellar.org',
  'https://horizon.stellar.lobstr.co',
  'https://horizon.publicnode.org',
];

export function copyText(text: string) {
  clipboard.writeText(text);
}

export async function handleResponse(response: Response) {
  const { headers, ok } = response;
  const contentType = headers.get('content-type');

  const content = contentType
    ? contentType.includes('json')
      ? response.json()
      : response.text()
    : { status: response.status, message: response.statusText };

  if (ok) return content;
  else throw await content;
}

export const getAccount = async (horizonUrl: string, publicKey: string) => {
  return fetch(horizonUrl + `/accounts/${publicKey}`).then(handleResponse);
};

export const getFee = () => {
  return fetch(HORIZON_URL + `/fee_stats`)
    .then(handleResponse)
    .then((feeStats) => feeStats.fee_charged.max)
    .catch(() => '100000');
};

export async function* generateXdr(
  source: string,
  amount: string,
  accountList: { publicKey: string }[]
) {
  const accountInfo = await getAccount(HORIZON_URL, source);
  const account = new Account(accountInfo.id, accountInfo.sequence);

  let transactionBuilder = new TransactionBuilder(account, {
    fee: await getFee(),
    networkPassphrase: NETWORK,
  });

  for (let i = 0; i < accountList.length; i++) {
    const destination = accountList[i].publicKey;

    await getAccount(horizonEndpoints[i % horizonEndpoints.length], destination)
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
