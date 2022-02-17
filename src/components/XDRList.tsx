import { useRecoilValue } from 'recoil';
import { progressSelector, settingsAtom, xdrListAtom } from 'src/utils/atoms';
import { copyText, getHorizonConfig } from 'src/utils/utils';
import { Transaction } from 'stellar-base';
import 'twin.macro';

import SVGSpinner from './SVGSpinner';

const XDRList = () => {
  const xdrList = useRecoilValue(xdrListAtom);
  const status = useRecoilValue(progressSelector);
  const { isTestnet } = useRecoilValue(settingsAtom);

  const { network } = getHorizonConfig(isTestnet);

  return (
    <div>
      {status === 'empty' ? (
        <p>Please upload a CSV file to begin.</p>
      ) : (
        status === 'loading' && <SVGSpinner />
      )}

      {xdrList.length > 0 && (
        <div tw="w-full space-y-8">
          {xdrList.map((xdr, index) => {
            const { operations, sequence, fee } = new Transaction(xdr, network);

            return (
              <div key={`${index}-${xdr}`}>
                <textarea
                  tw="w-full rounded-md p-2 bg-dark"
                  rows={4}
                  value={xdr}
                  readOnly
                />
                <div tw="flex items-center gap-2 font-mono flex-wrap">
                  <div tw="flex gap-8">
                    <p>{`Ops: ${operations.length}`}</p>
                    <p>{`Seq: ...${sequence.substring(
                      sequence.length - 4
                    )}`}</p>
                    <p>{`Fee: ${fee}`}</p>
                  </div>

                  <button
                    tw="block bg-secondary px-4 py-2 rounded ml-auto active:bg-opacity-90 transition-colors"
                    onClick={() => copyText(xdr)}
                  >
                    Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default XDRList;
