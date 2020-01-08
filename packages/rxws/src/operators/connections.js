import { filter, map } from 'rxjs/operators';

import { CONNECT, RECONNECT_DONE } from '../internals/actions';

const connections = function connections() {
  return source$ => source$.pipe(
    map(([,action]) => action),
    filter(action => [CONNECT, RECONNECT_DONE].indexOf(action.type) > -1),
    map(action => action.data)
  );
};

export default connections;
