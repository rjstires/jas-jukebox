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
    if (!currentSong) {
      return;
    }

    const seek = currentSong.howl.seek() || 0;

    if (typeof seek === 'number') {
      setTime(seek)
    }

  }, currentSong ? 100 : null);

  return (
    <>
      {secondsToDisplayTime(time)}
    </>
  );
}

export default Runtime;
