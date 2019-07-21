import queue$ from './queue$';
import { flatMap } from 'rxjs/operators';
import { tail } from './utilities';
import { of } from 'rxjs';

export default queue$
  .pipe(
    flatMap((queue) => of(tail(queue))),
  );
