import omit from 'lodash/omit';
import {merge,Observable,of,throwError} from 'rxjs';
import {
  delay,
  filter,
  map,
  mergeAll,
  retryWhen,
  shareReplay,
  take,
  tap,
  timeout,
  withLatestFrom
} from 'rxjs/operators';

const defaultOptions = {
  shouldWaitForConfirmation: false,
  shouldRetry: false,
  maxTimeout: 10000,
  validateResponse: responseArgs => !!responseArgs[0],
  retryDelay: 10000,
  retryCount: 3,
  retryFunction: null,
};

// binary can be an ArrayBuffer, Uint8Array, Blob, File and Buffer
function getMessageArgs(message) {
  const topic = message.topic || 'message';
  const binary = message.binary ? [message.binary] : [];
  const formattedMessage = omit(message, 'topic', 'binary');
  return [topic, formattedMessage, ...binary];
}

function sendWithTransactions({
  message,
  socket,
  action,
  // If true, messages will wait in line for the prior message to be received
  // before the next is emitted. (It forces sequential data transfer.)
  maxTimeout,
  // Should take a response and return true if response is valid, otherwise
  // false:
  validateResponse,
  shouldRetry,
  retryDelay,
  retryCount,
  retryFunction, // custom function to pass to retryWhen operator
}) {
  const transaction$ = new Observable(obs => {
    socket
      .binary(!!message.binary)
      .compress(!!message.binary)
      .emit(...getMessageArgs(message), (...responseArgs) => {
        if (!validateResponse(responseArgs)) {
          return obs.error(new Error('Server did not acknowledge response'));
        }
        obs.next([socket, action]);
        return obs.complete();
      });
  });
  return transaction$.pipe(
    timeout(maxTimeout),
    (
      shouldRetry
      ? retryWhen(retryFunction || (
          shouldRetry
          ? error$ => error$.pipe(delay(retryDelay), take(retryCount))
          : () => of()
      ))
      : tap(() => 1)
    )
  );
}

function sendMessage(params) {
  const {action, message, shouldWaitForConfirmation, socket} = params;
  if (shouldWaitForConfirmation) return sendWithTransactions(params);
  socket.binary(!!message.binary)
    .compress(!!message.binary)
    .emit(...getMessageArgs(message));
  return of([socket, action]);
}

const send = function send({
  io$, // stream of websocket events from the core ws() Observable
  ...options
}) {
  if (!io$.subscribe) {
    return throwError(new Error(
      'send() operator takes an Observable as its first parameter.'
    ));
  }
  const config = {...defaultOptions, ...options};
  // stream of data objects (any valid data type) to be sent to the server
  return messageIn$ => {
    const wsEvent$ = io$.pipe(shareReplay(1));
    const sendStream$ = messageIn$.pipe(
      withLatestFrom(wsEvent$),
      map(([message, [socket, action]]) => (
        sendMessage({message, socket, action, ...config})
      )),
      mergeAll(config.shouldWaitForConfirmation ? 1 : null)
    );
    // ensure that both streams get subscribed to
    return merge(wsEvent$, sendStream$).pipe(
      filter(() => false) // this never emits data...
    );
  };
};

export const testExports = {sendWithTransactions};
export default send;
