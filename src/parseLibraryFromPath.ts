import { sync as globSyng } from 'glob';
import { parseFile } from 'music-metadata';

async function parseLibraryFromPath(pathToLibrary: string) {
  const songPaths = globSyng(`${pathToLibrary}/**/*.{mp3,m4a}`);

  const values: any[] = [];
  for (const songPath of songPaths) {
    const {
      common: { artist, title, album, year },
      format: { duration },
    } = await parseFile(songPath, { skipCovers: true });

    values.push({
      duration: duration,
      album,
      artist,
      title,
      year,
      path: songPath,
    });
  }

  return values;
}
export default parseLibraryFromPath;
