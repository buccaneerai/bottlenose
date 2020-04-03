import {merge,of,throwError} from 'rxjs';
import {
  bufferWhen,
  filter,
  map,
  mergeMap,
  pairwise,
  share,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';

// import {CONNECT} from '../internals/actions';
import io from '../creators/io';
import send from './send';
import consume from './consume';

const errors = {
  noUrl: new Error('conduit operator requires a {url<String>}'),
};

function createMessageBuffer(message$, ioEvent$) {
  const messageInSub$ = message$.pipe(share());
  const ioEventSub$ = ioEvent$.pipe(share());
  // close buffer whenever the socket connects
  const closeBuffer = () => ioEventSub$.pipe(
    map(([socket]) => socket && socket.connected),
    pairwise(),
    filter(([wasConnected, nowConnected]) => (!wasConnected && nowConnected)),
  );
  const bufferedMessage$ = messageInSub$.pipe(
    withLatestFrom(merge(of([null, null]), ioEventSub$)),
    // buffer messages whenever the socket is closed or not available
    filter(([, [socket]]) => !socket || !socket.connected),
    map(([message]) => message),
    bufferWhen(closeBuffer),
    mergeMap(bufferedItems => of(...bufferedItems)),
  );
  return bufferedMessage$;
}

const conduit = function conduit({
  url,
  socketOptions = {},
  stop$ = of(),
  // serializer = JSON.stringify,
  // deserializer = JSON.parse,
  _send = send,
  _consume = consume,
  _io = io,
  bufferOnDisconnect = true,
}) {
  return messageIn$ => {
    const messageInSub$ = messageIn$.pipe(share());
    if (!url) return throwError(errors.noUrl);
    const ioEvent$ = _io({url, socketOptions, stop$}).pipe(
      // tap(([socket]) => console.log('IO', socket)),
      share(),
    );
    const bufferedMessage$ = createMessageBuffer(messageInSub$, ioEvent$);
    const unbufferedMessage$ = messageInSub$.pipe(
      withLatestFrom(merge(of([null, null]), ioEvent$)),
      filter(([,[socket]]) => socket && socket.connected),
      map(([message]) => message),
    );
    const input$ = (
      bufferOnDisconnect
      ? merge(unbufferedMessage$, bufferedMessage$)
      : messageInSub$
    );
    const publisher$ = input$.pipe(
      _send(ioEvent$),
      filter(() => false)
    );
    const consumer$ = ioEvent$.pipe(
      _consume(),
    );
    return merge(publisher$, consumer$).pipe(takeUntil(stop$));
  };
};

export const testExports = {createMessageBuffer};
export default conduit;
