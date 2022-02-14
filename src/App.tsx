import 'twin.macro';

import Progress from 'src/components/Progress';
import FileUpload from 'src/components/FileUpload';

import XDRList from './components/XDRList';
import Wallet from './components/Wallet';

function App() {
  return (
    <div tw="mx-auto max-w-3xl space-y-6 p-6">
      <Wallet />

      <FileUpload />

      <Progress />

      <XDRList />
    </div>
  );
}

export default App;
