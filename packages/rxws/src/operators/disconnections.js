import { filter, map } from 'rxjs/operators';

import { DISCONNECT } from '../internals/actions';

const connections = function connections() {
  return source$ => source$.pipe(
    map(([,action]) => action),
    filter(action => action.type === DISCONNECT),
    map(action => action.data)
  );
};

export default connections;
