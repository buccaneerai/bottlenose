import { of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import client from './client';

const broadcast = function broadcast(
  messageToSend$,
  serializer = JSON.stringify
) {
  return ws$ => ws$.pipe(
    client(),
    mergeMap(ws => (
      messageToSend$.subscribe
      ? of(ws)
      : throwError(new Error(
        'broadcast() operator takes an Observable as its first parameter.'
      ))
    )),
    mergeMap(ws => messageToSend$.pipe(
      map(message => ws.send(serializer(message)))
    ))
  );
};

export default broadcast;
