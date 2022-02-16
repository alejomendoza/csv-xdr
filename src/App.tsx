import tw from 'twin.macro';

import Wallet from 'src/components/Wallet';
import FileUpload from 'src/components/FileUpload';
import XDRList from 'src/components/XDRList';

function App() {
  return (
    <div tw="text-white mx-auto max-w-3xl space-y-6 p-6">
      <h1 tw="text-3xl font-bold text-center">CSV to XDR</h1>

      <StyledSection>
        <StyledTitle tw="text-center">Required CSV Format</StyledTitle>

        <table tw="w-1/2 mx-auto rounded-md overflow-hidden bg-black bg-opacity-20">
          <thead>
            <tr tw="all-child:p-2 bg-dark">
              <th scope="col">publicKey</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 3 }, (_, index) => (
              <tr key={index} tw="even:bg-dark">
                <td tw="text-center">G...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StyledSection>

      <StyledSection>
        <StyledTitle>1. Settings</StyledTitle>
        <Wallet />
      </StyledSection>

      <StyledSection>
        <StyledTitle>2. Upload</StyledTitle>
        <FileUpload />
      </StyledSection>

      <StyledSection>
        <StyledTitle tw="mb-4">3. XDR List</StyledTitle>
        <XDRList />
      </StyledSection>
    </div>
  );
}

const StyledSection = tw.section`bg-black bg-opacity-20 p-4 rounded-lg`;
const StyledTitle = tw.h2`font-bold text-lg mb-2`;

export default App;
