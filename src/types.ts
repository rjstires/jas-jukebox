
export type Artist = string;

export type Song = {
  artist: Artist;
  title: Artist;
};

export interface ExtendedSong extends Song {
  album: string;
  artist: string;
  title: string;
  year: number;
  path: string;
  duration: number;
}

export type SongWithKey = Song & { key: string };

export type PlayableSong = SongWithKey;

export type Tile = PlayableSong[];

export type Row = Tile[];
