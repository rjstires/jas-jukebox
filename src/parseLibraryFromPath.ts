import { sync as globSync } from "glob";
import { parseFile } from "music-metadata";
import { ExtendedSong } from "./types";
import { get, set } from "./storage";

function stringifySongPaths(paths: string[]): string {
  console.time(`stringifySongPaths`);
  const result = paths.join(" ");
  console.timeEnd(`stringifySongPaths`);
  return result;
}

async function storeCacheKey(challenge: string) {
  console.time(`set cache`);
  const result = set("cache", challenge);
  console.timeEnd(`set cache`);
  return result;
}

async function getLibraryCache() {
  console.time(`getLibraryCache:get`);
  const result: string = await get("library");
  console.timeEnd(`getLibraryCache:get`);

  console.time(`getLibraryCache:parse`);
  const obj = JSON.parse(result);
  console.timeEnd(`getLibraryCache:parse`);
  return obj;
}

function storeLibraryCache(values: ExtendedSong[]) {
  console.time(`storeLibraryCache:stringify`);
  const string = JSON.stringify(values);
  console.timeEnd(`storeLibraryCache:stringify`);

  console.time(`storeLibraryCache:set`);
  const result = set("library", string);
  console.timeEnd(`storeLibraryCache:set`);
  return result;
}

async function buildExtendedSongsFromPath(
  songPaths: string[],
  values: ExtendedSong[] = []
): Promise<ExtendedSong[]> {
  console.time(`buildExtendedSongsFromPath`);
  for (const path of songPaths) {
    const {
      common: { artist, title, year },
      format: { duration }
    } = await parseFile(path, { skipCovers: true, skipPostHeaders: true });
    if (duration && artist && title && year) {
      values.push({
        duration,
        artist,
        title,
        year,
        path
      });
    }
  }
  console.timeEnd(`buildExtendedSongsFromPath`);
  return values;
}

function buildSongPaths(pathToLibrary: string): string[] {
  console.time(`buildSongPaths`);
  const result = globSync(`${pathToLibrary}/**/*.{mp3,m4a}`);
  console.timeEnd(`buildSongPaths`);
  return result;
}

async function parseLibraryFromPath(pathToLibrary: string) {
  const songPaths = buildSongPaths(pathToLibrary);

  const cacheKey: string = await get("cache");

  const challenge = stringifySongPaths(songPaths);

  if (cacheKey === challenge) {
    return getLibraryCache();
  }

  await storeCacheKey(challenge);

  const values = await buildExtendedSongsFromPath(songPaths);

  await storeLibraryCache(values);

  return values;
}
export default parseLibraryFromPath;
