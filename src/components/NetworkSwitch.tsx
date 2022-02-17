import { useRecoilState } from 'recoil';
import tw, { styled } from 'twin.macro';

import { settingsAtom } from 'src/utils/atoms';

const NetworkSwitch = () => {
  const [{ isTestnet, disabled }, setSettings] = useRecoilState(settingsAtom);

  return (
    <ButtonGroup>
      <Button
        onClick={() =>
          setSettings((oldState) => ({ ...oldState, isTestnet: true }))
        }
        active={isTestnet}
        disabled={disabled}
      >
        Testnet
      </Button>
      <Button
        onClick={() =>
          setSettings((oldState) => ({ ...oldState, isTestnet: false }))
        }
        active={!isTestnet}
        disabled={disabled}
      >
        Public
      </Button>
    </ButtonGroup>
  );
};

const Button = styled.button((props: { active?: boolean }) => [
  tw`flex flex-1 justify-center items-center transition-colors p-2 bg-dark disabled:(cursor-not-allowed bg-black bg-opacity-25)`,
  props.active && tw`bg-secondary!`,
]);

const ButtonGroup = styled.div((props) => [tw`flex rounded overflow-hidden`]);

export default NetworkSwitch;
