import { concat, of, throwError } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

// import client from './client';

const broadcast = function broadcast(
  messageToSend$,
  serializer = JSON.stringify
) {
  // stream of the form [WebSocket, {type: 'ACTION_TYPE', data: {some: 'data'}}]
  return ws$ => {
    const sendStream$ = ws$.pipe(
      // client(),
      mergeMap(([ws]) => (
        messageToSend$.subscribe
        ? of(ws)
        : throwError(new Error(
          'broadcast() operator takes an Observable as its first parameter.'
        ))
      )),
      mergeMap(ws => messageToSend$.pipe(
        map(message => ws.send(serializer(message))),
        filter(() => false) // this stream will never emit data...
      ))
    );
    // FIXME - concat might not be the best operator for this but merge doesn't work...
    return concat(ws$, sendStream$);
  };
};

export default broadcast;
