import { fromEvent, interval, merge, NEVER, pipe } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, scan, startWith, switchMap } from 'rxjs/operators';
import action$ from './action$';
import comingUp$ from './comingUp$';
import { PER_PAGE } from './constants';
import createBoard, { nextButtonEl, previousButtonEl, setAlbum, setArtist, setComingUp, setQueueLength, setQueueRuntime, setRunningTime, setRuntime, setTitle } from './dom';
import library from './library';
import playNext$ from './playNext$';
import { carousel } from './utilities';

export const SONGS_COUNT = library.length;

export const PAGES = Math.ceil(SONGS_COUNT / PER_PAGE);

const changePage = carousel(0, PAGES - 1, 0);

merge(
  fromEvent(previousButtonEl, 'click')
    .pipe(mapTo(-1)),
  fromEvent(nextButtonEl, 'click')
    .pipe(mapTo(1)),
)
  .pipe(
    startWith(0),
    map((direction) => changePage(direction)),
  )
  .subscribe(pipe(
    (page: number) => library.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE),
    createBoard,
  ));

action$
  .pipe(
    filter(({ type }) => ['timer:start', 'timer:stop'].includes(type)),
    scan((isRunning, action) => {
      if (action.type === 'timer:start') {
        return true;
      }

      if (action.type === 'timer:stop') {
        return false;
      }

      return isRunning;
    }, false),
    switchMap((isRunning) => isRunning ? interval(1000) : NEVER),
  )
  .subscribe((seconds) => {
    setRunningTime(seconds);
  });

playNext$
  .subscribe(({ howl, title, artist, album, duration }) => {
    const sound = howl();

    sound.on('end', () => {
      setTitle();
      setArtist();
      setAlbum();
      setRuntime(0);
      setRunningTime(0);

      action$.next({ type: 'remove' });
      action$.next({ type: 'timer:stop' });
    });

    sound.on('play', () => {
      action$.next({ type: 'START' });
      action$.next({ type: 'timer:start' });
      setTitle(title);
      setArtist(artist);
      setAlbum(album);
      setRuntime(duration);
    });

    sound.play();
  });

comingUp$
  .pipe(
    distinctUntilChanged(),
  )
  .subscribe((queue) => {
    const len = queue.length;
    const totalDuration = queue.reduce((result, { duration }) => result + duration, 0);

    setComingUp(queue);
    setQueueLength(len);
    setQueueRuntime(totalDuration);
  });
