import { append, flatten, groupBy, map, pipe, repeat, splitEvery, toPairs } from 'ramda';

export const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z',
];

const toPages = pipe(
  splitEvery(2),
  splitEvery(6),
  splitEvery(10),
);

export const addAlphanumericToSongs = songs =>
  songs.map((song, idx) => ({ ...song, key: alphanumericFromIndex(6, idx) }));

export const normalizeLibrary = pipe(
  groupBy(({ artist }) => artist),
  toPairs,
  map(([_, value]: [string, object[]]) => value.length % 2 === 0 ? value : append(null, value)),
  flatten,
  fill(library => {
    const songsPerPage = 2 * 6 * 10;
    return Math.ceil(library.length / songsPerPage) * songsPerPage;
  }, {}),
  splitEvery(120),
  map(addAlphanumericToSongs),
  flatten,
  toPages
);

export function carousel(min: number, max: number, curr: number, step: number) {
  const next = curr + step;

  if (step === 0) {
    return curr;
  }

  curr = step < 0
    ? next < min
      ? max
      : next
    : next > max
      ? min
      : next;

  return Math.floor(curr);

}

export function fill(length: (list: any[]) => number, value: any = null) {
  return function (list: any[]) {
    const diff = length(list) - list.length;

    if (diff > 0) {
      const fill = repeat(value, diff);
      return list.concat(fill);
    }

    return list;
  }
}

export function getRowAndColumn(numberColumns: number, index: number) {
  const row = Math.floor(index / numberColumns);
  const col = index % numberColumns + 1
  return [row, col];
}

export const alphanumericFromIndex = pipe(
  getRowAndColumn,
  ([row, col]) => `${ALPHABET[row]}${col}`
);
