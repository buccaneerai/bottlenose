import {filter, map} from 'rxjs/operators';

import {NEW_MESSAGE} from '../internals/actions';

const messages = function messages(
  deserializer = JSON.parse
) {
  return source$ => source$.pipe(
    map(([,action]) => action),
    filter(action => action.type === NEW_MESSAGE),
    map(action => action.data),
    map(({message}) => message.data),
    map(deserializer)
  );
};

export default messages;
