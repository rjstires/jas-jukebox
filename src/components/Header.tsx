import { remote } from 'electron';
import path from 'ramda/es/path';
import React from 'react';
import { get } from '../storage';
import useConfig from '../useConfig';
import Display from './Display';

async function updatePathFromLocalStorage(callback) {
  const path = await get<string>('path');
  callback(path);
}

const Header = () => {
  const [state, handlers] = useConfig();
  const { currentSong } = state;
  const { setPath, nextPage, previousPage, songEnded } = handlers;

  React.useEffect(() => {
    updatePathFromLocalStorage(setPath);
  }, []);

  const title = path(['currentSong', 'title'], state);

  React.useEffect(
    () => {
      if (!currentSong) {
        return;
      }
      const player = currentSong.player();

      player.play();

      player.on('end', () => {
        songEnded();
      });

      return () => {
        player.unload();
      }

    },
    [title],
  );

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
