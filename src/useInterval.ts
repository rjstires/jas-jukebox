import { useCallback, useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
}

export function useTimeout(callback, delay, ...props) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      return savedCallback.current();
    }
    if (delay !== null) {
      let cleanup = () => {};
      let id = setTimeout(() => {
        cleanup = tick()
      }, delay);
      return () => {
        if(cleanup){
          cleanup();
        }
        clearInterval(id)
      };
    }
    return;
  }, [delay, ...props]);
}

export function useResetInterval<T extends (...args: any[]) => any>(callback: T, delay: number): [() => void] {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const intervalHandler = useRef<null | NodeJS.Timeout>(null);

  function initializeTimeout() {
    intervalHandler.current = setInterval(() => callbackRef.current(), delay);
    return () => {
      if (intervalHandler.current) {
        clearTimeout(intervalHandler.current)
      };
    }
  }

  useEffect(initializeTimeout, [delay])

  function resetInterval() {
    if (intervalHandler.current) {
      clearTimeout(intervalHandler.current);
    }

    intervalHandler.current = setInterval(() => callbackRef.current(), delay);
  }

  const resetCallback = useCallback(resetInterval, []);

  return [resetCallback];
}
