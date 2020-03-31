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
    tap(([wasConnected, isConnected]) => console.log(
      'Should socket be closed?',
      wasConnected,
      isConnected,
    )),
    filter(([wasConnected, nowConnected]) => (!wasConnected && nowConnected)),
    tap(() => console.log('CLOSE_BUFFER'))
  );
  const bufferedMessage$ = messageInSub$.pipe(
    withLatestFrom(merge(of([null, null]), ioEventSub$)),
    // buffer messages whenever the socket is closed or not available
    filter(([, [socket]]) => !socket || !socket.connected),
    tap(([m]) => console.log('Socket closed, item should be buffered', m)),
    map(([message]) => message),
    bufferWhen(closeBuffer),
    tap(m => console.log('Sending Buffer!', m)),
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
      tap(arr => console.log('EVENT', arr[1]))
    );
    const bufferedMessage$ = createMessageBuffer(messageInSub$, ioEvent$);
    const unbufferedMessage$ = messageInSub$.pipe(
      withLatestFrom(merge(of([null, null]), ioEvent$)),
      filter(([,[socket]]) => socket && socket.connected),
      map(([message]) => message),
      tap(m => console.log('sending immediately:', m)),
    );
    const input$ = (
      bufferOnDisconnect
      ? merge(unbufferedMessage$, bufferedMessage$)
      : messageInSub$
    );
    const conduit$ = input$.pipe(
      tap(data => console.log('MESSAGES being sent!', data)),
      _send(ioEvent$),
      _consume(),
      takeUntil(stop$)
    );
    return conduit$;
  };
};

export const testExports = {createMessageBuffer};
export default conduit;
