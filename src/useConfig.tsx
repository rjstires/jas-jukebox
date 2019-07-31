import { flatten } from 'ramda';
import React from 'react';
import actionCreatorFactor, { AnyAction, isType } from 'typescript-fsa';
import { rowsPerPage, songsPerPage, songsPerTile, tilesPerRow } from './constants';
import parseLibraryFromPath from './parseLibraryFromPath';
import { set } from './storage';
import { PlayableSong } from './types';
import { carousel, normalizeLibrary } from './utilities';

const actionCreator = actionCreatorFactor();

const setPath = actionCreator<string>('set-path');

const setLibrary = actionCreator<any[]>('set-library');

const setLoading = actionCreator<boolean>('set-loading');

const changePage = actionCreator<number>('change-page');

const setSelectionAlpha = actionCreator<string>('change-selection-alpha');

const setSelectionNumber = actionCreator<number>('change-selection-number');

const enqueueSelection = actionCreator<undefined | string>('enqueue-song');

const playSelection = actionCreator<undefined | string>('play-song');

const songEnded = actionCreator('song-ended');

/** State */
interface State {
  loading: boolean;
  error?: Error;
  path?: string;
  library?: any[];
  page: number;
  currentSong?: PlayableSong;
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
  loading: false,
  error: undefined,
  path: undefined,
  library: undefined,
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
  /** Config */
  setPath: (path: string) => void;

  /** Page */
  nextPage: () => void;
  previousPage: () => void;

  /** Selection */
  setSelectionAlpha: (v: string) => void;
  setSelectionNumeric: (v: number) => void;
  enqueueSelection: (key?: string) => void;

  songEnded: () => void;
}

const initialHandlers: Handlers = {
  setPath: () => undefined,
  nextPage: () => undefined,
  previousPage: () => undefined,
  setSelectionAlpha: () => undefined,
  setSelectionNumeric: () => undefined,
  enqueueSelection: () => undefined,
  songEnded: () => undefined,
};

const HandlersContext = React.createContext<Handlers>(initialHandlers);

/** Reducer */
function reducer(state: State, action: AnyAction): State {
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
    }
  }

  if (isType(action, changePage)) {
    const { library, page } = state;
    if (!library) {
      return state;
    }

    const nextPage = carousel(
      0,
      library.length - 1,
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
    const { library, page, selection: { alpha, numeric }, queue } = state;
    const { payload } = action;

    if (!library) {
      return state;
    }

    const key = payload
      ? payload
      : (alpha && numeric)
        ? alpha + numeric
        : undefined;

    if (!key) {
      return {
        ...state,
        selection: { alpha: undefined, numeric: undefined }
      };
    }

    const songs: any = flatten(flatten(flatten(library[page])));

    const found = songs.find((song) => song.key === key);

    if (!found.title) {
      return { ...state, selection: { alpha: undefined, numeric: undefined } };
    }

    const exists = queue.find(({ title }) => title === found.title);

    if (found === state.currentSong || exists) {
      return state;
    }

    return {
      ...state,
      queue: [...queue, found].filter((v, i, arr) => arr.indexOf(v) === i),
      selection: { alpha: undefined, numeric: undefined },
    }
  }

  if (isType(action, playSelection)) {
    const { library, page, selection: { alpha, numeric } } = state;
    const { payload } = action;

    if (!library) {
      return state;
    }

    const key = payload
      ? payload
      : (alpha && numeric)
        ? alpha + numeric
        : undefined;

    if (!key) {
      return {
        ...state,
        selection: { alpha: undefined, numeric: undefined }
      };
    }

    const songs: any = flatten(flatten(flatten(library[page])));

    const found = songs.find((song) => song.key === key);

    if (!found.title) {
      return {
        ...state,
        selection: {
          alpha: undefined,
          numeric: undefined,
        },
      };
    }

    return {
      ...state,
      currentSong: found,
      selection: { alpha: undefined, numeric: undefined },
    }
  }

  if (isType(action, songEnded)) {
    const { queue } = state;
    if (queue.length > 0) {
      return {
        ...state,
        currentSong: queue[0],
        queue: queue.slice(1),
      }
    }

    return {
      ...state,
      currentSong: undefined
    };
  }

  return state;
}


/** Provider */
export function ConfigProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handlers: Handlers = {
    setPath: async path => {
      dispatch(setPath(path));
      dispatch(setLoading(true));

      /** Sets path in localStorage (sorta) */
      set('path', path)

      try {
        const library = await parseLibraryFromPath(path);
        console.time(`normalizeLibrary`)
        dispatch(setLibrary(normalizeLibrary(library)));
        console.timeEnd(`normalizeLibrary`)
        dispatch(setLoading(false));
      } catch (error) { }
    },

    nextPage: () => dispatch(changePage(1)),

    previousPage: () => dispatch(changePage(-1)),

    setSelectionAlpha: alpha => dispatch(setSelectionAlpha(alpha)),

    setSelectionNumeric: number => dispatch(setSelectionNumber(number)),

    enqueueSelection: (v?: string) => {
      const { currentSong } = state;
      if (!currentSong) {
        dispatch(playSelection(v));
        return;
      }

      return dispatch(enqueueSelection(v));
    },

    songEnded: () => dispatch(songEnded()),
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
