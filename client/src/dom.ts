import action$ from './action$';
import { map, pipe, splitEvery } from './utilities';
import { Song } from './library';
import fitty from 'fitty';

const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z',
];

const PER_CARD = 2;
const ROWS = 10;
const COLS = 6;
const START = 0;

function alphanumericFromIndex(index: number) {
  const row = Math.floor(index / 6);
  const column = index % 6 + 1

  return `${ALPHABET[row]}${column}`;
}

export default pipe(
  /** @todo Can remove once we add filtering and ordering. */
  (songs) => {
    return songs.slice(START, PER_CARD * ROWS * COLS)
  },

  map((song, idx) => ({
    ...song,
    key: alphanumericFromIndex(idx),
  })),

  splitEvery(2),
  splitEvery(6),
  map(createRowEl),
  take(10),
  addRowElsToBoard,
  fitText
);

function fitText(rows) {
  fitty('.fit', { minSize: 6, maxSize: 18 });
  return rows;
}

function take(count: number): any {
  return (rows) => {
    return rows.slice(0, count);
  };
}

function addRowElsToBoard(rows: HTMLDivElement[]) {
  const board = document.getElementById('board');

  while (board.lastChild) {
    board.removeChild(board.lastChild);
  }

  board.append(...rows);

  return rows;
}

function createRowEl(row): any {
  const tiles = row.map(createTileElsFromPairs);

  const rowEl = document.createElement('div');
  rowEl.setAttribute('class', 'row');
  rowEl.append(...tiles);

  return rowEl;
}

function createTileElsFromPairs([firstSong, secondSong]) {
  const containerEl = document.createElement('div');
  containerEl.setAttribute('style', 'display:flex;');

  const selectorEl = document.createElement('div');
  selectorEl.setAttribute('class', 'selector');

  const topEl = document.createElement('div');
  topEl.innerText = firstSong.key;

  const bottomEl = document.createElement('div');
  bottomEl.innerText = secondSong.key;

  selectorEl.append(topEl, bottomEl);

  const tileEl = document.createElement('div');
  tileEl.setAttribute('class', 'tile');

  tileEl.append(
    createTitleEl(firstSong),
    createArtistEl(firstSong.artist),
    createTitleEl(secondSong),
  );

  containerEl.append(
    selectorEl,
    tileEl,
  );

  return containerEl;
}

function createArtistEl(text: string) {
  const el = document.createElement('div');
  el.setAttribute('class', 'artist');

  const el2 = document.createElement('div');

  const span = document.createElement('span');
  span.setAttribute('class', 'fit');
  span.innerText = text.toUpperCase();

  el2.append(span);

  el.append(el2)

  return el;
}

function createTitleEl(song: Song | null) {
  const el = document.createElement('div');
  el.setAttribute('class', 'title');

  const el2 = document.createElement('div');

  const span = document.createElement('span');
  span.setAttribute('class', 'fit');

  if (song.title) {
    span.innerText = song.title.toUpperCase();
    el2.onclick = function () {
      action$.next({ type: 'add', song: song });
    };
  } else {
    span.innerHTML = '&nbsp;';
  }

  el2.append(span);

  el.append(el2);

  return el;
}
