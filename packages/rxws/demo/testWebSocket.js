import { from, interval } from 'rxjs';
import takeRight from 'lodash/takeRight';
import { map, share, tap } from 'rxjs/operators';

import {
  broadcast,
  client,
  connections,
  disconnections,
  messages,
  ws,
  // wsManager as ws
} from '../src/index';

function startClient(
  url = 'ws://localhost:3002',
) {
  const ws$ = ws({url}).pipe(
    tap(([,e]) => console.log('EVENT', e)),
    share()
  );
  const client$ = ws$.pipe(client());
  const disconnect$ = ws$.pipe(disconnections());
  const connect$ = ws$.pipe(connections());
  const message$ = ws$.pipe(messages());
  const sendMessage$ = interval(5000).pipe(
    map(i => ({text: 'foo', i}))
  );
  const publish$ = ws$.pipe(broadcast(sendMessage$));
  client$.subscribe(c => console.log('CLIENT', c));
  connect$.subscribe(c => console.log('CONNECT', c));
  disconnect$.subscribe(d => console.log('DISCONNECT', d));
  message$.subscribe(m => console.log('MESSAGE', m));
  publish$.subscribe(
    r => console.log('RESPONSE', r),
    err => console.log('BROADCASE ERR', err),
    () => console.log('BROADCAST DONE')
  );
}

startClient();
