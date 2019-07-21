interface File {
  album: string;
  artist: string;
  title: string;
  year: number;
  path: string;
  duration: number;
}

interface Window {
  __FILES__: File[];
}
