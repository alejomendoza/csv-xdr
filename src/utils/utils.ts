import * as clipboard from 'clipboard-polyfill/text';
import {
  Account,
  Asset,
  Networks,
  Operation,
  TransactionBuilder,
  StrKey,
} from 'stellar-base';

export const getHorizonConfig = (isTestnet: boolean) => {
  if (isTestnet) {
    return {
      network: Networks['TESTNET'],
      horizonUrl: 'https://horizon-testnet.stellar.org',
      horizonEndpoints: ['https://horizon-testnet.stellar.org'],
    };
  }
  return {
    network: Networks['PUBLIC'],
    horizonUrl: 'https://horizon.stellar.org',
    horizonEndpoints: [
      'https://horizon.stellar.org',
      'https://horizon.stellar.lobstr.co',
      'https://horizon.publicnode.org',
    ],
  };
};

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

export const parseError = (error: any) => {
  if (error instanceof Error) error = error.toString();

  return {
    ...(typeof error === 'string' ? { message: error } : error),
  };
};

export const getAccount = async (horizonUrl: string, publicKey: string) => {
  return fetch(horizonUrl + `/accounts/${publicKey}`).then(handleResponse);
};

export const getFee = (horizonUrl: string) => {
  return fetch(horizonUrl + `/fee_stats`)
    .then(handleResponse)
    .then((feeStats) => feeStats.fee_charged.max)
    .catch(() => '100000');
};

export async function* generateXdr(
  source: string,
  amount: string,
  accountList: { publicKey: string }[],
  isTestnet: boolean
) {
  const { network, horizonUrl, horizonEndpoints } = getHorizonConfig(isTestnet);

  const accountInfo = await getAccount(horizonUrl, source);
  const account = new Account(accountInfo.id, accountInfo.sequence);

  let transactionBuilder = new TransactionBuilder(account, {
    fee: await getFee(horizonUrl),
    networkPassphrase: network,
  });

  for (let i = 0; i < accountList.length; i++) {
    const destination = accountList[i].publicKey;

    const iterationYield = {
      amountComplete: i + 1,
      isInvalid: false,
      xdr: '',
    };

    if (!StrKey.isValidEd25519PublicKey(destination)) {
      iterationYield.isInvalid = true;
    } else {
      await getAccount(
        horizonEndpoints[i % horizonEndpoints.length],
        destination
      )
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
    }

    if ((i + 1) % 100 === 0 || i === accountList.length - 1) {
      const xdr = transactionBuilder.setTimeout(0).build().toXDR();

      account.incrementSequenceNumber();

      transactionBuilder = new TransactionBuilder(account, {
        fee: await getFee(horizonUrl),
        networkPassphrase: network,
      });

      iterationYield.xdr = xdr;
    }

    await new Promise((resolve) =>
      setTimeout(() => resolve(i), 1000 / horizonEndpoints.length)
    );

    yield iterationYield;
  }
}
