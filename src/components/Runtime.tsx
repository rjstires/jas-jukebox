import React from 'react'
import { useInterval } from '../useInterval'
import useConfig from '../useConfig';
import { secondsToDisplayTime } from '../time';

const Runtime = () => {
  const [state] = useConfig();
  const { currentSong } = state;
  const [time, setTime] = React.useState(0)

  const title = currentSong && currentSong.title;

  React.useEffect(() => {
    setTime(0);
    return () => { };
  }, [title]);

  useInterval((v) => {
    setTime(time + 1)
  }, currentSong ? 1000 : null);

  return (
    <>
      {secondsToDisplayTime(time)}
    </>
  );
}

export default Runtime;
