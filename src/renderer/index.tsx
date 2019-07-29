/// <reference path="../common.d.ts" />

import '../assets/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Board from '../components/Board';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ConfigProvider } from '../useConfig';
import Player from '../components/Player';

const Main = () => {
  return (
    <>
      <ConfigProvider>
        <Player />
        <Header />
        <Board />
        <Footer />
      </ConfigProvider>
    </>
  )
}

ReactDOM.render(<Main />, document.getElementById('app'))
