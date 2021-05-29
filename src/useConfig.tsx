import { Howl } from 'howler';
import { flatten } from 'ramda';
import React, { useEffect } from 'react';
import actionCreatorFactor, { AnyAction, isType } from 'typescript-fsa';
import { rowsPerPage, songsPerPage, songsPerTile, tilesPerRow } from './constants';
import parseLibraryFromPath from './parseLibraryFromPath';
import { set } from './storage';
import { ExtendedSong, PlayableSong, SongWithKey } from './types';
import { useResetInterval } from './useInterval';
import { carousel, emptyRows, mapLibraryToPages } from './utilities';
import { v4 as uuidv4 } from 'uuid';

const actionCreator = actionCreatorFactor();

const setPath = actionCreator<string>('SET-PATH');

/** @todo Correct type*/
const setPages = actionCreator<(library: ExtendedSong[]) => ExtendedSong[]>('SET-PAGES');

/** @todo Correct type */
const setLibrary = actionCreator<ExtendedSong[]>('SET-LIBRARY');

const setLoading = actionCreator<boolean>('SET-LOADING');

const changePage = actionCreator<number>('CHANGE-PAGE');

const setSelectionAlpha = actionCreator<string>('CHANGE-SELECTION-ALPHA');

const setSelectionNumber = actionCreator<number>('CHANGE-SELECTION-NUMERIC');

const enqueueSelection = actionCreator<undefined | string>('ENQUEUE-SONG');

const nextSong = actionCreator<undefined>('NEXT-SONG');

const setVolume = actionCreator<number>('SET-VOLUME');

/** State */
interface State {
  volume: number;
  loading: boolean;
  error?: Error;
  path?: string;
  library?: ExtendedSong[];
  pages?: SongWithKey[][][][];
  page: number;
  currentSong?: PlayableSong & { howl: Howl };
  queue: PlayableSong[];
  songsPerTile: number;
  songsPerPage: number;
  tilesPerRow: number;
  rowsPerPage: number;
  runtime: number;
  selection: {
    alpha?: string;
    numeric?: number;
  };
}

const initialState: State = {
  volume: 0.5,
  loading: false,
  error: undefined,
  path: undefined,
  library: [],
  pages: [emptyRows],
  page: 0,
  currentSong: undefined,
  queue: [],
  songsPerTile,
  songsPerPage,
  tilesPerRow,
  rowsPerPage,
  runtime: 0,
  selection: {
    alpha: undefined,
    numeric: undefined,
  }
};

const StateContext = React.createContext<State>(initialState)


/** Handlers */
interface Handlers {
  /** Volume */
  setVolume: (volume: number) => void;

  /** Config */
  setPath: (path: string) => void;

  /** Page */
  nextPage: () => void;
  previousPage: () => void;

  /** Selection */
  setSelectionAlpha: (v: string) => void;
  setSelectionNumeric: (v: number) => void;
  enqueueSelection: (key?: string) => void;
  nextSong: () => void;

  setPages: (fn: (library: ExtendedSong[]) => ExtendedSong[]) => void;

  resetIdleTimer: () => void;
}

const initialHandlers: Handlers = {
  setVolume: () => undefined,
  setPath: () => undefined,
  nextPage: () => undefined,
  previousPage: () => undefined,
  setSelectionAlpha: () => undefined,
  setSelectionNumeric: () => undefined,
  enqueueSelection: () => undefined,
  nextSong: () => undefined,
  setPages: () => undefined,

  resetIdleTimer: () => undefined,
};

const HandlersContext = React.createContext<Handlers>(initialHandlers);

/** Reducer */
function reducer(state: State, action: AnyAction): State {
  if (isType(action, setVolume)) {
    const { payload } = action;

    return {
      ...state,
      volume: payload
    }
  }

  if (isType(action, setLoading)) {
    const { payload } = action;

    return {
      ...state,
      loading: payload
    }
  }

  if (isType(action, setPath)) {
    return {
      ...state,
      path: action.payload,
    }
  }

  if (isType(action, setLibrary)) {
    return {
      ...state,
      library: action.payload,
      loading: false,
    }
  }

  if (isType(action, setPages)) {
    const { library } = state;
    if (!library) {
      return state;
    }

    const filtered = action.payload(library);
    const pages = mapLibraryToPages(filtered)

    return { ...state, pages }
  }

  if (isType(action, changePage)) {
    const { pages, page } = state;
    if (!pages) {
      return state;
    }

    const nextPage = carousel(
      0,
      pages.length - 1,
      page,
      action.payload,
    );

    return {
      ...state,
      page: nextPage,
    }
  }

  if (isType(action, setSelectionAlpha)) {
    return {
      ...state,
      selection: {
        ...state.selection,
        alpha: action.payload,
      },
    }
  }

  if (isType(action, setSelectionNumber)) {
    return {
      ...state,
      selection: {
        ...state.selection,
        numeric: action.payload,
      },
    }
  }

  if (isType(action, enqueueSelection)) {
    const {
      currentSong,
      pages,
      page,
      queue,
      selection: { alpha, numeric },
    } = state;

    const { payload } = action;

    if (!pages) {
      return state;
    }

    const key = getKey(payload, alpha, numeric);

    if (!key) {
      return {
        ...state,
        selection: { alpha: undefined, numeric: undefined }
      };
    }

    const songs: any = flatten(flatten(flatten(pages[page])));

    const found = songs.find((song) => song.key === key);

    if (!found.title) {
      return {
        ...state,
        selection: { alpha: undefined, numeric: undefined, },
      };
    }

    /** If there is no current song we'll make this the current song. */
    if (!currentSong) {
      return {
        ...state,
        currentSong: createCurrentSong(found),
        selection: { alpha: undefined, numeric: undefined },
      }
    }

    /** Otherwise, put it in queue. */
    return {
      ...state,
      queue: [...queue, found],
      selection: { alpha: undefined, numeric: undefined },
    }
  }

  if (isType(action, nextSong)) {
    const { library, queue } = state;
    const next = queue[0] || findRandom(library);

    /** There are no songs left in queue. */
    if (!next) {
      return {
        ...state,
        currentSong: undefined,
        queue: [],
      };
    }

    return {
      ...state,
      currentSong: createCurrentSong(next),
      queue: queue.slice(1),
    }
  }

  return state;
}

function findRandom(library?: ExtendedSong[]) {
  if (!library) {
    return;
  }

  return library[Math.floor(Math.random() * library.length)];
}

function createCurrentSong(found: any): (PlayableSong & { howl: Howl; }) | undefined {
  return {
    ...found,
    playId: uuidv4(),
    howl: createHowl(found),
  };
}

function createHowl(found: any): Howl {
  return new Howl({
    autoplay: false,
    html5: true,
    preload: true,
    src: `file:///${found.path}`,
  });
}

function getKey(payload: string | undefined, alpha: string | undefined, numeric: number | undefined) {
  return payload
    ? payload
    : (alpha && numeric)
      ? alpha + numeric
      : undefined;
}

/** Provider */
export function ConfigProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [resetIdleTimer] = useResetInterval(() => {
    if (state.pages && state.pages.length > 1) {
      dispatch(changePage(1))
    }
  }, 30000);

  useEffect(() => {
    Howler.volume(state.volume);
  }, [state.volume]);

  const handlers: Handlers = {
    setVolume: (volume: number) => dispatch(setVolume(volume)),

    setPath: async path => {
      dispatch(setPath(path));
      dispatch(setLoading(true));

      set('path', path)

      try {
        console.time(`parseLibraryFromPath`)
        const library = await parseLibraryFromPath(path);
        console.timeEnd(`parseLibraryFromPath`)
        dispatch(setLibrary(library));
        resetIdleTimer();
      } catch (error) { }
    },

    nextPage: () => dispatch(changePage(1)),

    previousPage: () => dispatch(changePage(-1)),

    setSelectionAlpha: alpha => dispatch(setSelectionAlpha(alpha)),

    setSelectionNumeric: number => dispatch(setSelectionNumber(number)),

    enqueueSelection: (v?: string) => dispatch(enqueueSelection(v)),

    nextSong: () => dispatch(nextSong(undefined)),

    setPages: (fn) => dispatch(setPages(fn)),

    resetIdleTimer,
  };

  return (
    <StateContext.Provider value={state}>
      <HandlersContext.Provider value={handlers}>
        {children}
      </HandlersContext.Provider>
    </StateContext.Provider>
  );
}


/** Hooks */
function useState() {
  const context = React.useContext(StateContext);
  if (!context) {
    throw new Error(`useState must be used within the StateProvider.`);
  }
  return context;
}

function useHandlers() {
  const context = React.useContext(HandlersContext);
  if (!context) {
    throw new Error(`useHandlers must be used within the HandlersProvider.`);
  }
  return context;
}


/** Export */
export default function useConfig(): [State, Handlers] {
  return [
    useState(),
    useHandlers(),
  ];
};
