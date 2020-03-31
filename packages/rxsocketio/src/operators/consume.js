import {filter, map} from 'rxjs/operators';

import {NEW_MESSAGE} from '../internals/actions';

const consume = function consume(
  // deserializer = JSON.parse
) {
  return ws$ => ws$.pipe(
    map(([,action]) => action),
    filter(action => action.type === NEW_MESSAGE),
    map(action => action.data),
    // map(({message}) => message),
    // map(deserializer)
  );
};

export default consume;
