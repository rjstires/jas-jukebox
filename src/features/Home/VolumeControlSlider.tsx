import Slider from '@material-ui/core/Slider';
import React from 'react';
import useConfig from '../../useConfig';

export const VolumeControlSlider = () => {
  const [{ volume }, { setVolume }] = useConfig();

  function handleChange(e, newValue) {
    setVolume(newValue as number);
  }

  return (
    <Slider min={0} max={1} step={0.05} value={volume} onChange={handleChange} aria-labelledby="continuous-slider" />
  );
};
