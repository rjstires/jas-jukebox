import { filter, map, scan, flatMap } from 'rxjs/operators';
import queue$ from './queue$';
import { and, compose, either, isEmpty, length, lt, not, head } from './utilities';
import { of } from 'rxjs';

const previousQueue = (v: any[]) => v[0];

const queue = (v: any[]) => v[1];

export default queue$
  .pipe(
    scan(
      ([_, prev], current) => [prev, current],
      [[], []],
    ),
    filter(
      either(
        and(
          compose(isEmpty, previousQueue),
          compose(not, isEmpty, queue),
        ),
        and(
          compose(not, isEmpty, queue),
          lt(
            compose(length, queue),
            compose(length, previousQueue),
          ),
        ),
      )
    ),

    map(([_, next]) => next),
    flatMap((queue) =>  of(head(queue))),
  );
