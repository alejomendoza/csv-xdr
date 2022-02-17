import { useState } from 'react';
import { parse } from 'papaparse';
import { useSetRecoilState } from 'recoil';
import tw from 'twin.macro';

import { accountListAtom } from 'src/utils/atoms';

const FileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File>();

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

    const csvData = parse(csvText, { header: true }) as any;

    setAccountList(csvData.data);
    setIsLoading(false);
  };

  return (
    <div tw="space-y-2">
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
    </div>
  );
};

const StyledFileUpload = tw.p`flex items-center justify-center p-4 cursor-pointer rounded font-bold bg-secondary transition-colors`;

export default FileUpload;
