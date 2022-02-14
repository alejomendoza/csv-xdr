import { useRecoilState, useRecoilValue } from 'recoil';
import tw from 'twin.macro';

import { settingsAtom, progressSelector } from 'src/utils/atoms';

const Wallet = () => {
  const [{ amount, publicKey }, setSettings] = useRecoilState(settingsAtom);
  const status = useRecoilValue(progressSelector);

  const disabled = status !== 'empty';

  return (
    <div tw="space-y-2 max-w-xs">
      <StyledLabel>
        <span>Source Account:</span>
        <StyledInput
          disabled={disabled}
          type="text"
          placeholder="G..."
          value={publicKey}
          onChange={(e) =>
            setSettings((oldState) => ({
              ...oldState,
              publicKey: e.target.value,
            }))
          }
        />
      </StyledLabel>

      <StyledLabel>
        <span>Amount:</span>
        <StyledInput
          disabled={disabled}
          type="number"
          placeholder="Amount..."
          value={amount}
          min={0}
          onChange={(e) =>
            setSettings((oldState) => ({
              ...oldState,
              amount: e.target.value,
            }))
          }
        />
      </StyledLabel>
    </div>
  );
};

const StyledLabel = tw.label`flex gap-2 flex-wrap items-center`;
const StyledInput = tw.input`ml-auto p-1 bg-gray-100 border-2 border-gray-200 rounded disabled:(bg-gray-200 cursor-not-allowed)`;

export default Wallet;
