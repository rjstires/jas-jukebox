import { pipe } from "ramda";

export const addDuration = (total, { duration }) => total + duration;

export const secondsToTime: (number) => [number, number, number]
  = seconds => {
    if (seconds === 0) {
      return [0, 0, 0]
    }

    const hr = Math.floor(seconds / 3600);

    const min = Math.floor((seconds % 3600) / 60);

    const sec = Math.floor(seconds % 60);

    return [hr, min, sec]
  };

export const timeToString = (time: [number, number, number]) => {
  const [hh, mm, ss] = time;

  const m = String(mm).padStart(2, '0');
  const s = String(ss).padStart(2, '0');
  const h = String(hh).padStart(2, '0');

  return (hh > 0)
    ? `${h}:${m}:${s}`
    : `${m}:${s}`;
};


export const secondsToDisplayTime = pipe(secondsToTime, timeToString);
