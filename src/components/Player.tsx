import path from 'ramda/es/path';
import React from 'react';
import { get } from '../storage';
import useConfig from '../useConfig';

async function updatePathFromLocalStorage(callback) {
  const path = await get<string>('path');
  callback(path);
}

const Player = () => {
  const [state, handlers] = useConfig();
  const { currentSong } = state;
  const { setPath, songEnded } = handlers;

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
  return null;
}

export default Player;
