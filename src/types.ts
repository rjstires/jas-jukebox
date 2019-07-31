
export type Artist = string;

export type Song = {
  artist: Artist
};

export interface PlayableSong extends Song {
  album: string;
  artist: string;
  title: string;
  year: number;
  path: string;
  duration: number;
  key?: string;
  player: () => Howl;
}
