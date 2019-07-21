/// <reference path="./globals.d.ts" />

import { Howl } from 'howler'

export type SongIdentifier = number;

export interface Song {
  path: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: number;
  howl: Howl;
}

export type Library = Map<SongIdentifier, Song>;

const library: Library = new Map();

const files = window.__FILES__;

files.forEach((file, idx) => {
  const { path } = file;

  const obj: Song = {
    ...file,
    howl: () => new Howl({
      src: [path],
      sprite: { intro: [0, 5000] },
    }),
  };

  library.set(idx, obj);
});

export default library;
