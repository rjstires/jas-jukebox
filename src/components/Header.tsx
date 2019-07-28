import { remote } from 'electron';
import React from 'react';
import useConfig from '../useConfig';
import Display from './Display';

const Header = () => {
  const [, handlers] = useConfig();
  const { setPath, nextPage, previousPage, songEnded } = handlers;

  const handleChangeClick = () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (paths) => {
      if (!paths) {
        return;
      }
      setPath(paths[0]);
    })
  };

  const handlePreviousPageClick = () => {
    previousPage();
  };

  const handleNextPageClick = () => {
    nextPage();
  };

  const handleSkipClick = () => {
    songEnded();
  }

  return (
    <div className="header">
      <div className="side">
        <button className="control-button" onClick={handleChangeClick}>CHANGE</button>
      </div>
      <div className="center">
        <Display />
      </div>
      <div className="side">
        <button onClick={handlePreviousPageClick} className="control-button">&lt;</button>
        <button onClick={handleSkipClick} className="control-button skip">SKIP</button>
        <button onClick={handleNextPageClick} className="control-button">&gt;</button>
      </div>
    </div>
  );
}

export default Header;
