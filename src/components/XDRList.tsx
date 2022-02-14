import { useRecoilValue } from 'recoil';
import { progressSelector, xdrListAtom } from 'src/utils/atoms';
import { copyText, NETWORK } from 'src/utils/utils';
import { Transaction } from 'stellar-sdk';
import 'twin.macro';

import SVGSpinner from './SVGSpinner';

const XDRList = () => {
  const xdrList = useRecoilValue(xdrListAtom);
  const status = useRecoilValue(progressSelector);

  return (
    <div>
      <h1 tw="flex gap-2 items-center text-2xl font-bold mb-2">
        <span>XDR List:</span>
        {status === 'loading' && <SVGSpinner />}
      </h1>

      {status === 'empty' && <p>Please upload a CSV file to begin.</p>}

      {xdrList.length > 0 && (
        <div tw="w-full space-y-8">
          {xdrList.map((xdr, index) => {
            const { operations, sequence, fee } = new Transaction(xdr, NETWORK);

            return (
              <div key={`${index}-${xdr}`}>
                <textarea
                  tw="w-full p-2 bg-gray-100"
                  rows={4}
                  value={xdr}
                  readOnly
                />
                <div tw="flex items-center gap-8 font-mono">
                  <p>{`Ops: ${operations.length}`}</p>
                  <p>{`Seq: ${sequence}`}</p>
                  <p>{`Fee: ${fee}`}</p>

                  <button
                    tw="block bg-gray-100 px-4 py-2 rounded ml-auto hover:bg-gray-200 active:bg-gray-300 transition-colors"
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
