import { useState } from 'react';
import { parse } from 'papaparse';
import { useSetRecoilState } from 'recoil';
import { StrKey } from 'stellar-base';
import tw from 'twin.macro';

import { accountListAtom, AccountType } from 'src/utils/atoms';

const FileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [{ duplicate, invalid }, setInvalidRows] = useState<InvalidData>({
    duplicate: [],
    invalid: [],
  });

  const setAccountList = useSetRecoilState(accountListAtom);

  const parseFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const csvFile = e.target.files?.[0];
    if (!csvFile) return;

    setFile(csvFile);

    const reader = new FileReader();
    const csvText = await new Promise<any>((resolve) => {
      reader.onload = (e) => {
        resolve(e.target?.result);
      };
      reader.readAsText(csvFile);
    });

    const { data } = parse<AccountType>(csvText, {
      header: true,
      delimiter: ',',
    });
    const { filteredData, invalidRows } = cleanupData(data);

    setInvalidRows(invalidRows);
    setAccountList(filteredData);
    setIsLoading(false);
  };

  return (
    <div tw="space-y-4">
      <label tw="block">
        <input
          type="file"
          multiple={false}
          accept=".csv"
          onChange={parseFile}
          tw="hidden invisible opacity-0 disabled:sibling:(cursor-not-allowed bg-black bg-opacity-20)"
          disabled={isLoading || !!file}
        />
        <StyledFileUpload>
          {isLoading ? '✋ Loading' : !!file ? '✔️ Uploaded' : '🗂️ Upload'}
        </StyledFileUpload>
      </label>

      {(invalid.length > 0 || duplicate.length > 0) && (
        <div tw="space-y-2">
          <p tw="w-full text-center font-bold">Keys removed for you:</p>

          {invalid.length > 0 && (
            <div>
              <p>Invalid key found in row:</p>
              <StyledList>
                {invalid.map((row) => (
                  <li key={row}>{row + 2}</li>
                ))}
              </StyledList>
            </div>
          )}

          {duplicate.length > 0 && (
            <div>
              <p>Duplicate key found in row:</p>
              <StyledList>
                {duplicate.map((row) => (
                  <li key={row}>{row + 2}</li>
                ))}
              </StyledList>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StyledFileUpload = tw.p`flex items-center justify-center p-4 cursor-pointer rounded font-bold bg-secondary transition-colors`;
const StyledList = tw.ul`flex flex-wrap gap-4`;

type InvalidData = { duplicate: number[]; invalid: number[] };

const cleanupData = (array: AccountType[]) => {
  const set = new Set<string>();
  const invalidRows: InvalidData = { duplicate: [], invalid: [] };

  const filteredData = array.filter(({ publicKey }, row) => {
    if (!StrKey.isValidEd25519PublicKey(publicKey)) {
      invalidRows.invalid.push(row);
      return false;
    }

    if (set.has(publicKey)) {
      invalidRows.duplicate.push(row);
      return false;
    }

    set.add(publicKey);
    return true;
  });

  return { invalidRows, filteredData };
};

export default FileUpload;
