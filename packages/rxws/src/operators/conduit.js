import {merge,of,throwError} from 'rxjs';
import {
  bufferWhen,
  filter,
  map,
  mergeMap,
  pairwise,
  share,
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
  // close buffer whenever the socket connects
  const closeBuffer = () => wsSub$.pipe(
    map(([socket]) => socket),
    pairwise(),
    // tap(([priorSocket, socket]) => console.log(
    //   (!priorSocket || priorSocket.readyState !== 1)
    //   && socket.readyState === 1
    // )),
    filter(([priorSocket, socket]) => (
      (!priorSocket || priorSocket.readyState !== 1)
      && socket.readyState === 1
    )),
    // tap(() => console.log('CLOSE_BUFFER'))
  );
  const bufferedMessage$ = messageInSub$.pipe(
    withLatestFrom(merge(of([null, null]), wsSub$)),
    // buffer messages whenever the socket is closed or not available
    filter(([, [socket]]) => !socket || socket.readyState !== 1),
    map(([message]) => message),
    bufferWhen(closeBuffer),
    // tap(m => console.log('buffer', m)),
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
      // tap(([socket]) => console.log('WS', socket)),
      share(),
      takeUntil(stop$),
      // tap(arr => console.log('EVENT', arr[1]))
    );
    const bufferedMessage$ = createMessageBuffer(messageInSub$, ws$);
    const unbufferedMessage$ = messageInSub$.pipe(
      withLatestFrom(merge(of([null, null]), ws$)),
      filter(([,[socket]]) => socket && socket.readyState === 1),
      map(([message]) => message),
      // tap(m => console.log('sending immediately:', m)),
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
