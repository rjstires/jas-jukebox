import React from 'react'
import useConfig from '../useConfig';

import Runtime from './Runtime'
import defaultTo from 'ramda/es/defaultTo';
import pathOr from 'ramda/es/pathOr';
import { secondsToDisplayTime } from '../time';
import path from 'ramda/es/path';
const defaultToHyphen = defaultTo('-');

const OrSpace = ({ value }) => {
  if (value !== undefined) {
    return value;
  }
  return <>&nbsp;</>;
}

const Display = () => {
  const [{ selection, currentSong, queue }] = useConfig();

  const title = path(['title'], currentSong);
  const artist = path(['artist'], currentSong);
  const album = path(['album'], currentSong);
  const duration = pathOr(0, ['duration'], currentSong);

  const selectionDisplay = defaultToHyphen(selection.alpha) + defaultToHyphen(selection.numeric);

  return (
    <div className="lcd">

      <div className="now-playing">
        <div className="title text-center">NOW PLAYING</div>
        <div><OrSpace value={title} /></div>
        <div><OrSpace value={artist} /></div>
        <div><OrSpace value={album} /></div>
        <div className="split">
          <div style={{ flex: 1 }}>Run Time:</div>
          <div style={{ flex: 0 }}>
            <Runtime />
          </div>
          &nbsp;/&nbsp;
          <span>{secondsToDisplayTime(duration)}</span>
        </div>
        <div className="split">
          <div>Coming Up: <span>{queue.length}</span></div>
          <div>
            {
              secondsToDisplayTime(
                queue.reduce((result, song) => result + song.duration, 0)
              )
            }
          </div>
        </div>
      </div>

      <div className="credit-selection">
        <div className="title">CREDITS</div>
        <div>01</div>
        <div className="title">SELECTION</div>
        <div>{selectionDisplay}</div>
      </div>

      <div className="coming-up">
        <div className="title">COMING UP</div>
        {queue.map((song) => <div key={song.title}>{song.title}</div>)}
      </div>

    </div>
  );
};

export default Display;
