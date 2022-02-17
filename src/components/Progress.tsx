import { useRecoilValue } from 'recoil';
import 'twin.macro';

import { accountListAtom, progressAtom } from 'src/utils/atoms';

const Progress = () => {
  const { status, amountComplete, error } = useRecoilValue(progressAtom);
  const accountList = useRecoilValue(accountListAtom);

  return (
    <div>
      <div tw="flex justify-center relative bg-dark rounded p-1 z-0">
        <div
          tw="absolute inset-0 rounded bg-gradient-to-b from-green-500 to-green-800 z-index[-1]"
          style={{
            width:
              accountList.length > 0
                ? `${(amountComplete / accountList.length) * 100}%`
                : 0,
          }}
        />
        <p>
          {
            {
              empty: 'Progress',
              loading: `Loading: ${amountComplete}/${accountList.length}`,
              complete: 'Complete',
              error: 'Error',
            }[status]
          }
        </p>
      </div>

      {error && (
        <div tw="mt-2 p-4 overflow-auto bg-dark bg-opacity-50 rounded-md">
          <pre
            tw="text-xs leading-6"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(error, null, 2),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Progress;
