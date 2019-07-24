import fitty from 'fitty';
import action$ from './action$';
import { COLS, PER_PAGE } from './constants';
import { Song } from './library';
import { alphanumericFromIndex, fill, map, pipe, splitEvery } from './utilities';
import { durationToDispaly } from './time';

/** Selectors */
export const previousButtonEl = document.getElementById('control:previous-page');

export const nextButtonEl = document.getElementById('control:next-page');

export default pipe(
  fill(PER_PAGE),
  map((song, idx) => ({
    ...song,
    key: alphanumericFromIndex(COLS, idx),
  })),
  splitEvery(2),
  splitEvery(6),
  map(createRowEl),
  addRowElsToBoard,
  fitText
);

function fitText(rows) {
  fitty('.fit', { minSize: 6, maxSize: 18 });
  return rows;
}

function addRowElsToBoard(rows: HTMLDivElement[]) {
  const board = document.getElementById('board');

  while (board.lastChild) {
    board.removeChild(board.lastChild);
  }

  board.append(...rows);

  return rows;
}

function createRowEl(row) {
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
  span.innerHTML = text
    ? text.toUpperCase()
    : '&nbsp;';

  el2.append(span);

  el.append(el2)

  return el;
}

export function createTitleEl(song: Song | null) {
  const el = document.createElement('div');
  el.setAttribute('class', 'title');

  const el2 = document.createElement('div');

  const span = document.createElement('span');
  span.setAttribute('class', 'fit');

  if (song) {
    el2.onclick = function () {
      action$.next({ type: 'add', song: song });
    };

    span.innerHTML = song.title
      ? song.title.toUpperCase()
      : '&nbsp;';
  }

  el2.append(span);

  el.append(el2);

  return el;
}

export function keepSpace(el: HTMLElement, v?: string) {
  return el.innerHTML = v || '&nbsp;';
}

export function setRuntime(duration: any) {
  const el = document.getElementById('run-time');

  keepSpace(
    el,
    durationToDispaly(duration)
  )
}

export function setAlbum(album?: string) {
  const el = document.getElementById('album-text');
  keepSpace(el, album);
}

export function setArtist(artist?: string) {
  const el = document.getElementById('artist-text');
  keepSpace(el, artist);
}

export function setTitle(title?: string) {
  const el = document.getElementById('title-text');
  keepSpace(el, title);
}

export function setRunningTime(seconds: number) {
  const el = document.getElementById('run-time-remaining');
  keepSpace(
    el,
    durationToDispaly(seconds),
  );
}

export function setQueueRuntime(totalDuration: any) {
  const el = document.getElementById('queue-runtime');
  el.innerText = durationToDispaly(totalDuration);
}

export function setQueueLength(len: number) {
  const el = document.getElementById('queue-length');
  el.innerText = String(len);
}

export function setComingUp(queue: any[]) {
  const el = document.getElementById('display:list-coming-up');
  while (el.lastChild) {
    el.removeChild(el.lastChild);
  }
  el.append(...queue.slice(0, 5).map(({ title }) => {
    const el = document.createElement('div');
    el.innerText = title;
    return el;
  }));
}
