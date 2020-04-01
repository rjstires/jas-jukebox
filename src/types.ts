
export type Artist = string;

export type Song = {
  artist: Artist;
  title: Artist;
};

export interface ExtendedSong extends Song {
  artist: string;
  title: string;
  year: number;
  path: string;
  duration: number;
  sortableArtist: string;
}

export type SongWithKey = ExtendedSong & { key: string };

export type PlayableSong = SongWithKey;

export type Tile = PlayableSong[];

export type Row = Tile[];
