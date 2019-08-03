import { useEffect, useRef } from 'react';

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
