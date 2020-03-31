import { merge, of, throwError } from 'rxjs';
import { filter, mergeMap, share, withLatestFrom } from 'rxjs/operators';

// import client from './client';

const send = function send(
  io$, // stream of websocket events from the core ws() Observable
  // serializer = JSON.stringify // optional serializer function for messages
) {
  // stream of data objects (any valid data type) to be sent to the server
  return messageIn$ => {
    // FIXME - this will cause a problem if the ws does not emit any events...
    // therefore, the ws creator should ensure that it is a ReplaySubject or
    // BehaviorSubject so that it always emits at least one instance of the
    // socket client.
    const wsEvent$ = (
      io$.subscribe && io$.pipe
      ? io$.pipe(share())
      : throwError(new Error(
        'send() operator takes an Observable as its first parameter.'
      ))
    );
    // FIXME - this code will cause messages to buffer in memory or fail to send
    // if the websocket is not ready
    const sendStream$ = messageIn$.pipe(
      // FIXME - this should validate that the message is a valid type
      // which can be sent over a websocket like Buffer, ArrayBuffer, String, etc
      withLatestFrom(wsEvent$),
      mergeMap(([message, [socket, action]]) => {
        socket.emit(
          message.topic ? message.topic : 'message',
          message
        );
        return of([socket, action]);
      }),
      filter(() => false) // this never emits data...
    );
    // ensure that both streams get subscribed to
    return merge(wsEvent$, sendStream$);
  };
};

export default send;
