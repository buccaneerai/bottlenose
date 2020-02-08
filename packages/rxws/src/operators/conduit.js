import {merge,of,throwError} from 'rxjs';
import {
  bufferWhen,
  filter,
  map,
  mergeMap,
  pairwise,
  scan,
  share,
  shareReplay,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';

// import {CONNECT} from '../internals/actions';
import ws from '../creators/ws';
import broadcast from './broadcast';
import consume from './consume';

const errors = {
  noUrl: new Error('conduit operator requires a {url<String>}'),
};

function createMessageBuffer(message$, ws$) {
  const messageInSub$ = message$.pipe(share());
  const wsSub$ = ws$.pipe(share());
  // close buffer whenever the socket reconnects
  const closeBuffer = () => wsSub$.pipe(
    pairwise(),
    // tap(e => console.log('SOCKETS', e)),
    filter(([priorSocket, socket]) => (
      (!priorSocket || !priorSocket.OPEN) && socket.OPEN
    )),
    // tap(console.log('CLOSE BUFFER')),
  );
  const bufferedMessage$ = messageInSub$.pipe(
    withLatestFrom(merge(of([null]), wsSub$)),
    // tap(d => console.log('data', d)),
    // buffer messages whenever the socket is closed or not available
    filter(([, [socket]]) => !socket || !socket.OPEN),
    map(([message]) => message),
    bufferWhen(closeBuffer),
    mergeMap(bufferedItems => of(...bufferedItems)),
  );
  return bufferedMessage$;
}

const conduit = function conduit({
  url,
  stop$ = of(),
  socketOptions = {},
  serializer = JSON.stringify,
  deserializer = JSON.parse,
  _broadcast = broadcast,
  _consume = consume,
  _ws = ws,
  bufferOnDisconnect = true,
}) {
  return messageIn$ => {
    const messageInSub$ = messageIn$.pipe(share());
    if (!url) return throwError(errors.noUrl);
    const ws$ = _ws({url, socketOptions}).pipe(
      shareReplay(1),
      takeUntil(stop$),
    );
    const bufferedMessage$ = createMessageBuffer(messageInSub$, ws$);
    const unbufferedMessage$ = messageInSub$.pipe(
      withLatestFrom(ws$),
      filter(([,[socket]]) => socket && socket.OPEN),
      map(([message]) => message)
    );
    const input$ = (
      bufferOnDisconnect
      ? merge(unbufferedMessage$, bufferedMessage$)
      : messageInSub$
    );
    const conduit$ = input$.pipe(
      _broadcast(ws$, serializer),
      _consume(deserializer),
      takeUntil(stop$)
    );
    return conduit$;
  };
};

export const testExports = {createMessageBuffer};
export default conduit;
