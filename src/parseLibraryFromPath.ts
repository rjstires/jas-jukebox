import { sync as globSyng } from 'glob';
import { parseFile } from 'music-metadata';
import { ExtendedSong } from './types';

async function parseLibraryFromPath(pathToLibrary: string) {
  const songPaths = globSyng(`${pathToLibrary}/**/*.{mp3,m4a}`);

  const values: ExtendedSong[] = [];
  for (const songPath of songPaths) {
    const {
      common: { artist, title, year },
      format: { duration },
    } = await parseFile(songPath, { skipCovers: true });

    if (duration && artist && title && year) {
      values.push({
        duration: duration,
        artist,
        title,
        year,
        path: songPath,
      });
    }
  }

  return values;
}
export default parseLibraryFromPath;
