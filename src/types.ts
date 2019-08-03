
export type Artist = string;

export type Song = {
  artist: Artist;
  title: Artist;
};

export type SongWithKey = Song & { key: string };

export interface PlayableSong extends SongWithKey {
  album: string;
  artist: string;
  title: string;
  year: number;
  path: string;
  duration: number;
}

export type Tile = PlayableSong[];

export type Row = Tile[];
