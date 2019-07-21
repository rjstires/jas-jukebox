import { scan } from 'rxjs/operators';
import action$ from './action$';

const reducer = (queue, action) => {
  if (action.type === 'add') {
    return [...queue, action.song];
  }

  if (action.type === 'remove') {
    return queue.slice(1);
  }

  return queue;
};

export default action$
  .pipe(
    scan(reducer, [])
  );
