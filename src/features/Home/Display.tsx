import { defaultTo, map, path, pathOr, pipe, reduce, take } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { secondsToDisplayTime } from '../../time';
import { PlayableSong } from '../../types';
import useConfig from '../../useConfig';
import Runtime from './Runtime';

const defaultToHyphen = defaultTo('-');

const Root = styled.div`
  display: flex;
  background: black;
  color: #008dbc;
  font-family: "LED Dot Matrix";
  font-size: 16px;
  line-height: 18px;
  margin: 0px;
  border: inset 2px;
`;

const Title = styled.div`
  color: #be2a2c;
  font-size: 16px;
  line-height: 18px;
`;

const CenteredTitle = styled(Title)`
  text-align: center;
`;

const NowPlaying = styled.div`
  flex: 5;
  padding: 4px;
`;

const CreditSelection = styled.div`
  flex: 2;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Split = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ComingUp = styled.div`
  flex: 5;
  padding: 4px;
  text-align: center;
`;

const OrSpace = ({ value }) => {
  if (value !== undefined) {
    return value;
  }
  return <>&nbsp;</>;
}

const createComingUp = pipe<PlayableSong[], PlayableSong[], JSX.Element[]>(
  take(5),
  map(({ title }) => <div key={title}>{title}</div>),
);

const createQueueRuntime = pipe<PlayableSong[], Number, String>(
  reduce((result, song) => result + song.duration, 0),
  secondsToDisplayTime,
);

const Display = () => {
  const [{ selection, currentSong, queue }] = useConfig();

  const title = path(['title'], currentSong);
  const artist = path(['artist'], currentSong);
  const duration = pathOr(0, ['duration'], currentSong);

  const selectionDisplay = defaultToHyphen(selection.alpha) + defaultToHyphen(selection.numeric);

  const comingUp = createComingUp(queue);

  const queueRuntime = createQueueRuntime(queue);

  return (
    <Root>
      <NowPlaying>
        <CenteredTitle>NOW PLAYING</CenteredTitle>
        <div><OrSpace value={title} /></div>
        <div><OrSpace value={artist} /></div>
        <Split>
          <div style={{ flex: 1 }}>Run Time:</div>
          <div style={{ flex: 0 }}>
            <Runtime />
          </div>
          &nbsp;/&nbsp;
          <span>{secondsToDisplayTime(duration)}</span>
        </Split>
        <Split>
          <div>Coming Up: <span>{queue.length}</span></div>
          <span>{queueRuntime}</span>
        </Split>
      </NowPlaying>

      <CreditSelection>
        <Title>CREDITS</Title>
        <div>01</div>
        <Title>SELECTION</Title>
        <div>{selectionDisplay}</div>
      </CreditSelection>

      <ComingUp>
        <Title>COMING UP</Title>
        {comingUp}
      </ComingUp>

    </Root>
  );
};

export default Display;
