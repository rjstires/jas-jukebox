import { path } from 'ramda';
import React from 'react';
import { get } from '../storage';
import useConfig from '../useConfig';
import { useTimeout } from '../useInterval';

async function setPathFromUserData(callback) {
  const path = await get<string>('path');
  callback(path);
}

const Player = () => {
  const [state, handlers] = useConfig();
  const { currentSong } = state;
  const { setPath, nextSong } = handlers;

  React.useEffect(() => {
    setPathFromUserData(setPath);
  }, []);

  const title = path(['currentSong', 'title'], state);

  useTimeout(() => {
    if (!currentSong) {
      return;
    }

    const song = currentSong;
    const player = song.howl;

    player.on('play', () => {
      console.log(`Play: ${song.title}`)
    })

    player.on('end', () => {
      console.log(`Ended: ${song.title}`)
      nextSong();
    });

    player.on('stop', () => {
      console.log(`Stopped: ${song.title}`)
      nextSong();
    });

    player.play();

    return () => {
      player.unload();
    }
  }, title ? 3000 : null, title);

  return null;
}

export default Player;
