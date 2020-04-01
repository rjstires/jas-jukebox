import storage from 'electron-json-storage';
import { ExtendedSong } from './types';

const configName = 'config';

interface ConfigStorage {
  path: string;
  cache: string;
  library: ExtendedSong[];
}

type Keys = keyof ConfigStorage

export function get<T>(key: Keys) {
  return new Promise<T>((resolve, reject) => {
    storage.get(
      configName,
      (err, config) => { err ? reject(err) : resolve(config[key] as any) },
    )
  })
}

export async function set<T>(key: Keys, value: ConfigStorage[typeof key]) {
  return new Promise<T>(async (resolve, reject) => {

    storage.get(configName, (getError, config) => {
      if (getError) {
        return reject(getError)
      }

      const updatedConfig: ConfigStorage = { ...(config as ConfigStorage), [key]: value };

      storage.set(
        configName,
        updatedConfig,
        setError => setError ? reject(setError) : resolve(),
      );
    });
  });

}
