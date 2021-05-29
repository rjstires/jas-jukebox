import { append, chain, groupBy, last, pipe, prop, repeat, sortBy, splitEvery, times, toLower, toPairs } from 'ramda';
import { ALPHABET, rowsPerPage, songsPerPage, songsPerTile, tilesPerRow } from './constants';
import { Artist, Row, Song, SongWithKey, Tile, PlayableSong } from './types';

type Pair = [Artist, Song[]];

/** A tile contains X songs. */
export const splitToTile: (s: any[]) => any[][] = splitEvery(songsPerTile);

/** A row contains X tiles. */
export const splitToRow: (s: any[]) => any[][] = splitEvery(tilesPerRow);

/** A page contains X rows */
export const splitToPage: (s: any[]) => any[] = splitEvery(rowsPerPage);

/** The app contains W pages of X rows of Y tiles of Z songs.  */
export const toApp = pipe(splitToTile, splitToRow, splitToPage);

export const mapRowAndColToKey = ([row, col]) => `${ALPHABET[row]}${col}`;

export const getRowAndColumn = (numberColumns: number, index: number): [number, number] => {
  const row = Math.floor(index / numberColumns);
  const col = index % numberColumns + 1
  return [row, col];
}

export const keyFromIndex = pipe(getRowAndColumn, mapRowAndColToKey);

export const addKey = songs => songs.map((song, idx) => ({
  ...song,
  key: keyFromIndex(tilesPerRow, idx),
}));

/**
 * Given a Pair, fill the Song[] with a null element if it's an odd length.
 */
export const fillOddRows = ([artist, songs]) => {
  return [
    artist,
    songs.length % songsPerTile === 0 ? songs : append({ artist: artist }, songs),
  ]
};

/**
 * Currently there is no intent, or reasonable alternative, to sorting by artist so it's safe
 * to hardcode this.
 */
export const sortByArtist = sortBy(pipe(prop('sortableArtist'), toLower));

/**
 * In a jukebox if an artist has a odd number of tracks they will display a blank bottom tile before
 * moving on to the next artist. To resolve that issue we group the songs by the artist and add a
 * null element to any list of songs which has an odd length. Sorting is happening before the
 * fill operation since the null elements wont have artist information.
 */
export const sortAndFillSongs = pipe<Song[], Song[], Record<Artist, Song[]>, Pair[], Song[]>(
  sortByArtist,
  groupBy(({ artist }) => artist),
  toPairs,
  chain(pipe(fillOddRows, last)),
);

/**
 * A jukebox will always display tiles, even if there are fewer songs than the current page. So
 * we fill in the array to the total page length with emtpy objects. This allows us to render
 * empty tiles.
 */
const fillLastPage = fill<Song>(library => Math.ceil(library.length / (songsPerTile * tilesPerRow * rowsPerPage)) * (songsPerTile * tilesPerRow * rowsPerPage), { artist: '', title: '' });

/** We need to add the selection key to eacy song. Keys are contextual to the page, so we split
 * the songs into pages, apply the key values using chain (flatMap).
 */
const addKeyByPage = pipe<Song[], Song[][], SongWithKey[]>(
  splitEvery(songsPerPage),
  chain(addKey),
);

/**
 * Allow step iteration, forward and backward, through a list.
 *
 * @param min {number} The lower bound of the list, usually 0.
 * @param max {number} The upper bound, usually list length - 1.
 * @param curr {number} The current position within the list.
 * @param step {number} The number of steps to proceed. Can be a negative number to move backward.
 */
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

/**
 * Fill a list to a desired lenght with a value;
 *
 * @param length {Function} A function which returns the desired length of the array.
 * @param value {any} The value to fill with.
 */
export function fill<T>(length: (list: T[]) => number, value: T) {
  return function (list: T[]) {
    const diff = length(list) - list.length;

    if (diff > 0) {
      const fill = repeat(value, diff);
      return list.concat(fill);
    }

    return list;
  }
}

const mockSongs: Song[] = times(() => ({ artist: '', title: '' }), songsPerPage);

export const mapLibraryToPages = pipe<
  Song[], Song[], Song[], SongWithKey[], PlayableSong[][][][]
>(sortAndFillSongs, fillLastPage, addKeyByPage, toApp);

export const emptyRows = pipe<Song[], SongWithKey[], Tile[], Row[]>(
  addKey,
  splitToTile,
  splitToRow,
)(mockSongs);

export function debounce(func: Function, wait: number, immediate?: boolean) {
  var timeout;
  return function (this: any) {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
