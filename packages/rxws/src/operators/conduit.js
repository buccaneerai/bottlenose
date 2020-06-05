import {merge,of,throwError} from 'rxjs';
import {
  bufferWhen,
  filter,
  map,
  mergeMap,
  pairwise,
  share,
  shareReplay,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';

// import {CONNECT} from '../internals/actions';
import ws from '../creators/ws';
import send from './send';
import consume from './consume';

const errors = {
  noUrl: () => new Error('conduit operator requires a {url<String>}'),
};

function createMessageBuffer(ws$) {
  return messageIn$ => {
    const wsSub$ = ws$.pipe(share());
    // close buffer whenever the socket connects
    const closeBuffer = () => wsSub$.pipe(
      map(([socket]) => socket && socket.readyState === 1),
      pairwise(),
      filter(([wasConnected, nowConnected]) => (!wasConnected && nowConnected)),
    );
    const bufferedMessage$ = messageIn$.pipe(
      withLatestFrom(merge(of([null, null]), wsSub$)),
      // buffer messages whenever the socket is closed or not available
      filter(([, [socket]]) => !socket || socket.readyState !== 1),
      map(([message]) => message),
      bufferWhen(closeBuffer),
      mergeMap(bufferedItems => of(...bufferedItems)),
    );
    return bufferedMessage$;
  };
}

function passthroughMessageBuffer(ws$) {
  return messageIn$ => messageIn$.pipe(
    withLatestFrom(merge(of([null, null]), ws$)),
    filter(([,[socket]]) => socket && socket.readyState === 1),
    map(([message]) => message)
  );
}

function bufferMessages(
  ws$,
  _createMessageBuffer = createMessageBuffer,
  _passthroughMessageBuffer = passthroughMessageBuffer,
) {
  return messageIn$ => {
    const messageInSub$ = messageIn$.pipe(share());
    const wsSub$ = ws$.pipe(share());
    // buffer messages when socket.io client is not ready to send them
    const bufferedMessage$ = messageInSub$.pipe(
      _createMessageBuffer(wsSub$)
    );
    // when messages don't need to be buffered, simply pass them through
    const unbufferedMessage$ = messageInSub$.pipe(
      _passthroughMessageBuffer(wsSub$)
    );
    return merge(bufferedMessage$, unbufferedMessage$);
  };
}

const conduit = function conduit({
  url,
  bufferOnDisconnect = true,
  socketOptions = {},
  stop$ = of(),
  serializer = JSON.stringify,
  deserializer = JSON.parse,
  _send = send,
  _consume = consume,
  _ws = ws,
  _bufferMessages = bufferMessages,
} = {}) {
  if (!url) return () => throwError(errors.noUrl());
  return messageIn$ => {
    const messageInSub$ = messageIn$.pipe(shareReplay(1));
    const ws$ = _ws({url, socketOptions}).pipe(
      takeUntil(stop$),
      shareReplay(1),
    );
    const producer$ = messageIn$.pipe(
      (bufferOnDisconnect ? _bufferMessages(ws$) : tap(() => true)),
      takeUntil(stop$),
      _send(ws$, serializer),
      filter(() => false), // this should not emit any items
    );
    const consumer$ = ws$.pipe(
      _consume(deserializer)
    );
    return merge(producer$, consumer$);
  };
};

export const testExports = {createMessageBuffer};
export default conduit;
