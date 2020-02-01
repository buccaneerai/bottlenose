import {of} from 'rxjs';
import {mergeMap,takeUntil} from 'rxjs/operators';

import ws from '../creators/ws';
import broadcast from './broadcast';
import messages from './messages';

const conduit = function conduit({
  url,
  stop$ = of(),
  socketOptions = {},
  serializer = JSON.stringify,
  deserializer = JSON.parse,
}) {
  return source$ => {
    const conduit$ = ws({url, socketOptions}).pipe(
      broadcast(source$, serializer),
      messages(deserializer),
      takeUntil(stop$)
    );
    return conduit$;
  };
};

export default conduit;
