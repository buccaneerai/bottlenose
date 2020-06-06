import { of, merge, ReplaySubject, throwError, zip } from 'rxjs';
import {filter, map, mergeMap, scan, share} from 'rxjs/operators';

export const MESSAGE_TO_SEND = 'send/MESSAGE_TO_SEND';

const errors = {
  wsParam: () => (
    new Error('send() operator takes an Observable as its first parameter.')
  )
};

const sendMessage = (serializer = JSON.stringify) => {
  return ([message, [socket]]) => socket.send(serializer(message));
};

const cacheMessagesUntilSocketEmits = ([buffer,socket], next) => {
  // if a socket event previously emitted, then pass items through one by one
  if (socket && next[0]) return [[next[0]], socket];
  if (socket && next[1]) return [[], next[1]]; // no message to send
  return (
    next[1]
    // if the socket is available for the first time, send all messages
    ? [[...buffer, ...(next[0] ? [next[0]] : [])], next[1]]
     // otherwise, continue to cache the messages
    : [[...buffer, ...(next[0] ? [next[0]] : [])], null]
  );
};

const bufferMessages = () => allEvent$ => {
  return allEvent$.pipe(
    map(event => (
      event.type === MESSAGE_TO_SEND
      ? [event.message, null]
      : [null, event]
    )),
    scan(cacheMessagesUntilSocketEmits, [[], null]),
    // don't send until socket is available
    filter(([messages, wsEvent]) => !!wsEvent && messages && messages.length),
    // flatten so that messages are sent individually
    mergeMap(([messages, wsEvent]) => of(...messages.map(m => [m, wsEvent]))),
  );
};

const send = function send(
  ws$, // stream of websocket events from the core ws() Observable
  serializer = JSON.stringify, // optional serializer function for messages
  _sendMessage = sendMessage
) {
  if (!ws$.subscribe || !ws$.pipe) return () => throwError(errors.wsParam());
  // stream of data objects (any valid data type) to be sent to the server
  return messageIn$ => {
    const wsSub$ = ws$.pipe(share());
    const messageEvent$ = messageIn$.pipe(
      map(message => ({message, type: MESSAGE_TO_SEND}))
    );
    const readyMessage$ = merge(messageEvent$, wsSub$).pipe(
      bufferMessages()
    );
    const sendStream$ = readyMessage$.pipe(
      map(_sendMessage(serializer)),
      filter(() => false) // never emit output
    );
    return merge(wsSub$, sendStream$); // return the unaltered ws$ stream
  };
};

export const testExports = {bufferMessages};
export default send;
