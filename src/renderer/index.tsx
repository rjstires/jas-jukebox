/// <reference path="../common.d.ts" />
/// <reference path="../../globals.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/styles.css';
import App from '../components/App';
import { ConfigProvider } from '../useConfig';

const Main = () => {
  return (
    <>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </>
  )
}

ReactDOM.render(<Main />, document.getElementById('app'))
