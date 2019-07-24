type Pred<T = any> = (v: T) => boolean;

export const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z',
];

export const push = <T>(list: T[] = [], item: T): T[] => [...list, item];

export const isEmpty = (v: any[]) => v.length === 0;

export const not = (v?: any) => Boolean(v) === false;

export const either = <T>(pred1: Pred<T>, pred2: Pred<T>) => (v: T) => pred1(v) || pred2(v);

export const and = <T>(pred1: Pred<T>, pred2: Pred<T>) => (v: T) => pred1(v) && pred2(v);

export const length = v => v.length;

export const inc = v => v + 1;

export const dec = v => v - 1;

export const lt = <T = any>(fn1: (v: T) => T, fn2: (v: T) => T) => (v: T) => fn1(v) < fn2(v);

export const gt = <T = any>(fn1: (v: T) => T, fn2: (v: T) => T) => (v: T) => fn1(v) > fn2(v);

export function pipe(...fns) {
  return function (...args) {
    let result = fns[0].apply(undefined, args);
    let i = 1;
    const len = fns.length;

    while (i < len) {
      result = fns[i].call(undefined, result);
      i += 1;
    }

    return result;
  }
}

export const compose = function (...fns: Function[]) {
  var length = fns.length;

  return function (...args: any[]) {
    var idx = length - 1,
      result = fns[idx].apply(this, args);
    while (idx--) {
      result = fns[idx].call(this, result);
    }
    return result;
  };
};

export function tail(list: any[]) {
  return list.slice(1);
}

export function head(list: any[]) {
  return list[0];
}

export function groupBy(key) {
  return function (arr) {
    var result = {},
      len = arr.length,
      i = 0;

    while (i < len) {
      const k = arr[i][key];
      const value = arr[i];
      result[k] = push(result[k], value);
      i += 1;
    }

    return result;
  }
}

export function toPairs(obj) {
  return Object.entries(obj);
}

export function map(iterator) {
  return function (arr) {
    return arr.map(iterator);
  }
}

export function tap(fn) {
  return function (val) {
    fn(val);
    return val;
  }
}

export function flatten() {
  return function (arr) {
    let result = [];
    const len = arr.length;
    let i = 0;

    while (i < len) {
      result = result.concat(arr[i]);
      i += 1;
    }
    return result;
  }
}

export function normalizeLibrary(songs) {
  return pipe(
    groupBy('artist'),
    toPairs,
    map(([_, value]: [string, object[]]) => value.length % 2 === 0 ? value : push(value, null)),
    flatten(),
  )(songs)
}

export function splitEvery(n) {
  return function (list) {
    const result = [];
    const len = list.length;
    let idx = 0;

    while (idx < len) {
      const segment = list.slice(idx, idx += n);
      result.push(segment);
    }

    return result;
  }
}

export function carousel(min: number, max: number, init: number = 0) {
  let curr = init;
  return function (step: number) {
    const next = curr + step;

    if (step === 0) {
      return curr;
    }

    curr = step < 0
      ? next < min
        ? max
        : next
      : next > max
        ? min
        : next;

    return curr;
  }
}


export function take(count: number): any {
  return (rows) => {
    return rows.slice(0, count);
  };
}

export function always(v) {
  return function () {
    return v;
  }
}

export function times(fn, times) {
  let idx = 0;
  const result = [];

  while (idx < times) {
    result.push(fn(idx));
    idx += 1;
  }

  return result;
}

export function repeat(value, n) {
  return times(always(value), n);
}

export function fill(length: number, value: any = null) {
  return function (list: any[]) {
    const diff = length - list.length;

    if (diff > 0) {
      const fill = repeat(value, diff);
      return list.concat(fill);
    }

    return list;
  }
}

export function getRowAndColumn(numberColumns: number, index: number) {
  const row = Math.floor(index / numberColumns);
  const col = index % numberColumns + 1
  return [row, col];
}

export const alphanumericFromIndex = pipe(
  getRowAndColumn,
  ([row, col]) => `${ALPHABET[row]}${col}`
);
