/// <reference path="./globals.d.ts" />

import { Howl } from 'howler'
import { normalizeLibrary } from './utilities';

export type SongIdentifier = number;

export interface Song {
  id: number;
  path: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: number;
  howl: Howl;
}

export type Library = Song[];

const files = window.__FILES__;

console.time('generate library');
const songs = files
  .map((file, id) => {
    const { path } = file;

    return {
      id,
      ...file,
      howl: () => new Howl({
        src: [path],
        // sprite: { intro: [0, 5000] },
      }),
    };
  });
console.timeEnd('generate library')

console.time('normalize library')
const library = normalizeLibrary(songs);
console.timeEnd('normalize library');

export default library;
