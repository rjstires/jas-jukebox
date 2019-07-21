import { interval, NEVER } from 'rxjs';
import { distinctUntilChanged, filter, scan, switchMap, tap } from 'rxjs/operators';
import action$ from './action$';
import comingUp$ from './comingUp$';
import { CreateLibrary } from './dom';
import library from './library';
import playNext$ from './playNext$';
import { durationToDispaly } from './time';

CreateLibrary(library);

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
    tap((seconds) => {
      setRunningTime(seconds);
    })
  )
  .subscribe();

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

    sound.play('intro');
  });

comingUp$
  .pipe(
    distinctUntilChanged(),

    tap((queue) => {
      const el = document.getElementById('coming-up');
      while (el.lastChild) {
        el.removeChild(el.lastChild);
      }

      el.append(
        ...queue.map(({ title }) => {
          const el = document.createElement('div');
          el.innerText = title;
          return el;
        })
      )
    }),

    tap((queue) => {
      const len = queue.length;
      const el = document.getElementById('queue-length');
      el.innerText = String(len);
    }),

    tap((queue) => {
      const el = document.getElementById('queue-runtime');
      const totalDuration = queue.reduce((result, { duration }) => result + duration, 0);
      el.innerText = durationToDispaly(totalDuration);
    }),
  )
  .subscribe();

function safelySetInnerText(el: HTMLElement, v?: string) {
  return v ? el.innerText = v : el.innerHTML = '&nbsp;';
}

function setRuntime(duration: any) {
  const el = document.getElementById('run-time');

  safelySetInnerText(
    el,
    durationToDispaly(duration)
  )
}

function setAlbum(album?: string) {
  const el = document.getElementById('album-text');
  safelySetInnerText(el, album);;
}

function setArtist(artist?: string) {
  const el = document.getElementById('artist-text');
  safelySetInnerText(el, artist);
}

function setTitle(title?: string) {
  const el = document.getElementById('title-text');
  safelySetInnerText(el, title);
}

function setRunningTime(seconds: number) {
  const el = document.getElementById('run-time-remaining');
  safelySetInnerText(
    el,
    durationToDispaly(seconds),
  );
}
