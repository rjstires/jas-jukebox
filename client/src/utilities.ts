type Pred<T = any> = (v: T) => boolean;

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
