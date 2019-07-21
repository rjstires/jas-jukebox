import { Song, SongIdentifier, Library } from "./library";
import library from './library';
import action$ from './action$'
import { secondsToTime } from "./time";

export const getElementById = (id: string) => document.getElementById(id);

export const getLibraryElement = () => getElementById('list');

export const getQueueElement = () => getElementById('queue');

export const getNowPlayingElement = () => getElementById('now-playing');

export function handleTitleClick(id: SongIdentifier) {
  const song = library.get(id);
  action$.next({ type: 'add', song });
}

export function createSection(id: number, artist: string, title: string) {
  const section = document.createElement('div');

  const titleSpan = createTitleSpan(`${title} by ${artist}`);

  const button = createQueueButton(id);

  section.append(titleSpan, button);

  return section;
}

export function createTitleSpan(title: string) {
  const span = document.createElement('span');
  span.append(title);
  return span;
}

export function createQueueButton(id: number) {
  const button = document.createElement('button');
  button.append('Enqueue');
  button.onclick = function name(e: MouseEvent) {
    handleTitleClick(id);
  };

  return button;
}

export function ComingUp(props: { queue: Song[] }) {
  const { queue } = props;

  const queueEl = getQueueElement();

  while (queueEl.lastChild) {
    queueEl.removeChild(queueEl.lastChild);
  }

  const list = document.createElement('ol');

  const items = queue.map(({ title, artist }) => {
    const titleElement = document.createElement('li');
    titleElement.append(`${title} by ${artist}`);
    return titleElement;
  });

  list.append(...items);

  queueEl.append(list);
}

export function NowPlaying(song: Song) {
  const { title, artist, album, duration } = song;

  const nowPlayingEl = getNowPlayingElement();

  while (nowPlayingEl.lastChild) {
    nowPlayingEl.removeChild(nowPlayingEl.lastChild);
  }

  const titleEl = document.createElement('p')
  titleEl.append(`Title: ${title}`)

  const artistEl = document.createElement('p')
  artistEl.append(`Artist: ${artist}`)

  const albumEl = document.createElement('p')
  albumEl.append(`Title: ${album}`)

  const x = secondsToTime(duration);
  const hh = String(x[0]).padStart(2, '0');
  const mm = String(x[1]).padStart(2, '0');
  const ss = String(x[2]).padStart(2, '0');
  const timeEl = document.createElement('p')
  timeEl.append(`Time: ${hh}:${mm}:${ss}`);

  nowPlayingEl.append(titleEl, artistEl, albumEl, timeEl);
}

export function CreateLibrary(songs: Library) {
  const libraryEl = getLibraryElement();

  while(libraryEl.lastChild){
    libraryEl.removeChild(libraryEl.lastChild);
  }

  const sections = [];
  for (const [songId, song] of songs) {
    sections.push(
      createSection(songId, song.artist, song.title),
    );
  }

  libraryEl.append(...sections);

}
