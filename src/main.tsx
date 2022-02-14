import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { GlobalStyles } from 'twin.macro';

import './utils/polyfills';
import App from './App';

import './index.css';

ReactDOM.render(
  <RecoilRoot>
    <GlobalStyles />
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);
