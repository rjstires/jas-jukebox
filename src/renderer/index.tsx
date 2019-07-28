import '../assets/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Board from '../components/Board';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ConfigProvider } from '../useConfig';

const Main = () => {
  return (
    <>
      <ConfigProvider>
        <Header />
        <Board />
        <Footer />
      </ConfigProvider>
    </>
  )
}

ReactDOM.render(<Main />, document.getElementById('app'))
