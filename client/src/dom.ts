import fitty from 'fitty';
import action$ from './action$';
import { Song } from './library';
import { durationToDispaly } from './time';
import { ALPHABET, map, pipe, splitEvery } from './utilities';

/** Selectors */
export const getPreviousButtonEl = () => document.getElementById('control:previous-page');

export const getNextButtonEl = () => document.getElementById('control:next-page');

export const getSelectionControlEls = () => document.getElementsByClassName('selection-control');

export const getSelectControlEl = () => document.getElementById('control:select');

export default pipe(
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
  const board = document.getElementById('section:board');

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

function createSelectSelectionButton() {
  const selectEl = document.createElement('button');
  selectEl.setAttribute('class', 'control-button');
  selectEl.setAttribute('id', 'control:select');
  selectEl.innerText = "SELECT";
  return selectEl;
}

function createAlphaSelectionButtons() {
  let idx = 0;
  const elements = [];
  const alphaIndex = 20; /** T */
  while (idx < alphaIndex) {
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('class', 'selection-control control-button white');
    buttonEl.setAttribute('id', `control:select:aplha:${ALPHABET[idx]}`);
    buttonEl.setAttribute('value', ALPHABET[idx]);
    buttonEl.innerText = ALPHABET[idx];
    elements.push(buttonEl);
    idx += 1;
  }
  return elements;
}

function createNumericSelectionButtons() {
  let idx = 1;
  const elements = [];

  while (idx <= 6) {
    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('class', 'selection-control control-button white');
    buttonEl.setAttribute('id', `control:select:numeric:${String(idx)}`);
    buttonEl.setAttribute('value', String(idx));
    buttonEl.innerText = String(idx);
    elements.push(buttonEl);
    idx += 1;
  }

  return elements;
}

export function createSelectionButtons() {
  const footerEl = document.getElementById('section:footer');
  while (footerEl.lastChild) {
    footerEl.removeChild(footerEl.lastChild);
  }

  footerEl.append(
    ...createAlphaSelectionButtons(),
    createSelectSelectionButton(),
    ...createNumericSelectionButtons()
  );
}

export const updateSelectionText = (key) => {
  const el = document.getElementById('display:selection')
  el.innerText = key;
  return key;
};;
