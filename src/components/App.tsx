import React from 'react';
import Board from './Board';
import Footer from './Footer';
import Header from './Header';
import Player from './Player';
import LoadingOverlay from './LoadingOverlay';
import useConfig from '../useConfig';

const App = () => {
  const [ { loading }] = useConfig();

  return (
    <>
      <LoadingOverlay show={loading} />
      <Player />
      <Header />
      <Board />
      <Footer />
    </>
  );
}

export default App;
