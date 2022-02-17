import { useRecoilState } from 'recoil';
import tw from 'twin.macro';

import { settingsAtom } from 'src/utils/atoms';

const Wallet = () => {
  const [{ amount, publicKey, disabled }, setSettings] =
    useRecoilState(settingsAtom);

  return (
    <div tw="flex flex-wrap gap-4">
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

const StyledLabel = tw.label`[span]:(block mb-1) flex-1 min-width[20ch]`;
const StyledInput = tw.input`w-full px-2 py-1 bg-dark rounded disabled:(bg-black bg-opacity-20 cursor-not-allowed)`;

export default Wallet;
