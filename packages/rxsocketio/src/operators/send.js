import omit from 'lodash/omit';
import { merge, of, throwError } from 'rxjs';
import { filter, mergeMap, shareReplay, withLatestFrom } from 'rxjs/operators';


// binary can be an ArrayBuffer, Uint8Array, Blob, File and Buffer
function getMessageArgs(message) {
  const topic = message.topic || 'message';
  const binary = message.binary ? [message.binary] : [];
  const formattedMessage = omit(message, 'topic', 'binary');
  return [topic, formattedMessage, ...binary];
}

const send = function send({
  io$, // stream of websocket events from the core ws() Observable
}) {
  // stream of data objects (any valid data type) to be sent to the server
  return messageIn$ => {
    const wsEvent$ = (
      io$.subscribe && io$.pipe
      ? io$.pipe(shareReplay(1))
      : throwError(new Error(
        'send() operator takes an Observable as its first parameter.'
      ))
    );
    const sendStream$ = messageIn$.pipe(
      withLatestFrom(wsEvent$),
      mergeMap(([message, [socket, action]]) => {
        socket.emit(...getMessageArgs(message));
        return of([socket, action]);
      })
    );
    // ensure that both streams get subscribed to
    return merge(wsEvent$, sendStream$).pipe(
      filter(() => false) // this never emits data...
    );
  };
};

export default send;
