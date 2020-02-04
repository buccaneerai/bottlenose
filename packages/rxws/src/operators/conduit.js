import {of,throwError} from 'rxjs';
import {shareReplay,takeUntil} from 'rxjs/operators';

import {CONNECT} from '../internals/actions';
import ws from '../creators/ws';
import broadcast from './broadcast';
import consume from './consume';

const errors = {
  noUrl: new Error('conduit operator requires a {url<String>}'),
};

const conduit = function conduit({
  url,
  stop$ = of(),
  socketOptions = {},
  serializer = JSON.stringify,
  deserializer = JSON.parse,
  _broadcast = broadcast,
  _consume = consume,
  _ws = ws,
  // bufferUntilConnect = true,
}) {
  return messageIn$ => {
    if (!url) return throwError(errors.noUrl);
    const ws$ = _ws({url, socketOptions}).pipe(
      shareReplay(1),
      takeUntil(stop$),
    );
    const conduit$ = messageIn$.pipe(
      _broadcast(ws$, serializer),
      _consume(deserializer),
      takeUntil(stop$)
    );
    return conduit$;
  };
};

export default conduit;
