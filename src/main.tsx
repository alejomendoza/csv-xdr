import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import './utils/polyfills';
import App from './App';

import './index.css';
import GlobalStyles from './styles/GlobalStyles';

ReactDOM.render(
  <RecoilRoot>
    <GlobalStyles />
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);
