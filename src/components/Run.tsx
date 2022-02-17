import { useState } from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import { StrKey } from 'stellar-base';
import tw from 'twin.macro';

import {
  accountListAtom,
  progressAtom,
  settingsAtom,
  xdrListAtom,
} from 'src/utils/atoms';
import { generateXdr, parseError } from 'src/utils/utils';
import Progress from './Progress';

let generator;

const Run = () => {
  const setXdrList = useSetRecoilState(xdrListAtom);
  const resetXdrList = useResetRecoilState(xdrListAtom);

  const setProgress = useSetRecoilState(progressAtom);
  const resetProgress = useResetRecoilState(progressAtom);

  const [invalidRows, setInvalidRows] = useState<{ row: number }[]>([]);

  const [
    { publicKey, amount, isTestnet, disabled: settingsDisabled },
    setSettings,
  ] = useRecoilState(settingsAtom);

  const accountList = useRecoilValue(accountListAtom);

  const runGenerator = async (data: any) => {
    resetXdrList();
    resetProgress();
    setInvalidRows([]);

    setSettings((oldState) => ({ ...oldState, disabled: true }));
    setProgress((oldState) => ({ ...oldState, status: 'loading' }));

    generator = generateXdr(publicKey, amount, data, isTestnet);

    try {
      for await (let { xdr, amountComplete, isInvalid } of generator) {
        if (xdr) setXdrList((oldState) => [...oldState, xdr!]);

        if (isInvalid) {
          setInvalidRows((oldState) => [...oldState, { row: amountComplete }]);
        }

        setProgress((oldState) => ({
          ...oldState,
          amountComplete,
        }));
      }

      setProgress((oldState) => ({ ...oldState, status: 'complete' }));
    } catch (e: any) {
      setProgress((oldState) => ({
        ...oldState,
        status: 'error',
        error: parseError(e),
      }));
    }

    setSettings((oldState) => ({ ...oldState, disabled: false }));
  };

  const isReady =
    StrKey.isValidEd25519PublicKey(publicKey) &&
    accountList.length > 0 &&
    !settingsDisabled;

  return (
    <div tw="space-y-2">
      <StyledButton
        disabled={!isReady}
        onClick={() => runGenerator(accountList)}
      >
        Run
      </StyledButton>

      <Progress />

      {invalidRows.length > 0 && (
        <div>
          <p>Invalid key found in row:</p>
          <ul tw="flex flex-wrap gap-4">
            {invalidRows.map(({ row }) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StyledButton = tw.button`flex items-center justify-center p-4 cursor-pointer rounded font-bold bg-secondary transition-colors w-full disabled:(cursor-not-allowed bg-black bg-opacity-20)`;

export default Run;
