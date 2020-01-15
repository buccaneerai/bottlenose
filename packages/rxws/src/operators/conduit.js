import {of} from 'rxjs';
import {mergeMap,takeUntil} from 'rxjs/operators';

import ws from '../creators/ws';
import broadcast from './broadcast';
import messages from './messages';

const conduit = function conduit({
  url,
  stop$ = of(),
  socketOptions = {},
}) {
  return source$ => source$.pipe(
    mergeMap(() => (
      ws({url, socketOptions}).pipe(
        broadcast(source$),
        messages()
      )
    )),
    takeUntil(stop$)
  );
};

export default conduit;
