import { fromEvent, interval, merge, NEVER, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, scan, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import action$ from './action$';
import comingUp$ from './comingUp$';
import { COLS, PER_PAGE } from './constants';
import createBoard, { createSelectionButtons, getNextButtonEl, getPreviousButtonEl, getSelectControlEl, getSelectionControlEls, setAlbum, setArtist, setComingUp, setQueueLength, setQueueRuntime, setRunningTime, setRuntime, setTitle, updateSelectionText } from './dom';
import library from './library';
import playNext$ from './playNext$';
import { alphanumericFromIndex, carousel, defaultToHyphen, fill, pipe } from './utilities';
import { Howler } from 'howler'
const createFilledPageSlice = (pageNumber, perPage, songs) => pipe(
  library => library.slice(pageNumber * perPage, pageNumber * perPage + perPage),
  fill(PER_PAGE),
  (songs) => songs.map((song, idx) => ({ ...song, key: alphanumericFromIndex(COLS, idx) })),
)(songs);

export const SONGS_COUNT = library.length;

export const PAGES = Math.ceil(SONGS_COUNT / PER_PAGE);

const changePage = carousel(0, PAGES - 1);

interface ElementTarget extends EventTarget {
  value: string;
  id?: string;
  class?: string;
}

interface ElementEvent extends Event {
  target: ElementTarget;
}

createSelectionButtons();

const previousPageClick$ = fromEvent<ElementEvent>(getPreviousButtonEl(), 'click');

const nextPageClick$ = fromEvent<ElementEvent>(getNextButtonEl(), 'click');

const selectionControlClick$ = fromEvent<ElementEvent>(getSelectionControlEls(), 'click');

const selectControlClick$ = fromEvent<ElementEvent>(getSelectControlEl(), 'click');

const mapSelectionToKey = ([left, right]) =>
  defaultToHyphen(left) + defaultToHyphen(right);

const selection$ =
  selectionControlClick$
    .pipe(
      map((e: ElementEvent) => e.target.value),
      startWith([null, null]),
      filter((value) => value !== 'select'),
      scan(([_, prevRight], value) => [prevRight, value]),
      tap(pipe(mapSelectionToKey, updateSelectionText)),
      tap(console.log),
    );

const pageNumber$ = merge(
  nextPageClick$
    .pipe(mapTo(1)),

  previousPageClick$
    .pipe(mapTo(-1)),
)
  .pipe(
    scan((current, direction) => changePage(current, direction), 0),
    startWith(0),
  );

const songsPage$ = merge(
  previousPageClick$,
  nextPageClick$,
)
  .pipe(
    startWith(null),
    withLatestFrom(
      of(library),
      pageNumber$,
      of(PER_PAGE),
      (event, library, pageNumber, perPage) => ({ event, library, pageNumber, perPage }),
    ),
    map((state) => createFilledPageSlice(state.pageNumber, state.perPage, state.library)),
  );

songsPage$
  .subscribe(createBoard);

selectControlClick$
  .pipe(
    withLatestFrom(
      selection$,
      songsPage$,
    ),
    tap(() => updateSelectionText('--'))
  )
  .subscribe(([_, selection, songsPage]) => {
    const key = mapSelectionToKey(selection);
    const song = songsPage.find(s => s.key === key);

    if(song && song.title){
      action$.next({ type: 'add', song });
    }
  });

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


  fromEvent(
    document.getElementById('control:skip'),
    'click'
  )
    .subscribe(() => {
      Howler.unload();

      setTitle();
      setArtist();
      setAlbum();
      setRuntime(0);
      setRunningTime(0);

      action$.next({ type: 'remove' });
      action$.next({ type: 'timer:stop' });

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
