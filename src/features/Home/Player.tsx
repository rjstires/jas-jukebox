import { path } from 'ramda';

import useConfig from '../../useConfig';
import { useTimeout } from '../../useInterval';

const Player = () => {
  const [state, handlers] = useConfig();
  const { currentSong } = state;
  const { nextSong } = handlers;

  const playId = path(['currentSong', 'playId'], state);

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
  }, playId ? 3000 : null, playId);

  return null;
}

export default Player;
